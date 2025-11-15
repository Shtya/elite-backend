import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  BadRequestException,
  Logger,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {
  User,
  AuthSession,
  VerificationStatus,
  NotificationType,
  NotificationChannel,
  UserType,
} from "entities/global.entity";
import {
  LoginDto,
  RegisterDto,
  VerifyOtpDto,
  ChangePasswordDto,
  ResetPasswordDto,
  UpdateProfileDto,
  EmailLoginDto,
  VerifyEmailOtpDto,
} from "../../dto/auth.dto";
import { MailService } from "common/nodemailer";
import * as bcrypt from "bcryptjs";
import { NotificationsService } from "src/notifications/notifications.service";

@Injectable()
export class AuthService {
  private readonly logger = new Logger("AuthService");
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(AuthSession)
    private authSessionRepository: Repository<AuthSession>,
    private jwtService: JwtService,
    private mailService: MailService,
    private notificationsService: NotificationsService
  ) {}

  async register(registerDto: RegisterDto): Promise<{ message: string }> {
    const existingUser = await this.usersRepository.findOne({
      where: [
        { email: registerDto.email },
        ...(registerDto.phoneNumber
          ? [{ phoneNumber: registerDto.phoneNumber }]
          : []),
      ],
    });

    if (existingUser) {
      throw new ConflictException(
        "User with this email (or phone) already exists"
      );
    }

    const passwordHash = await bcrypt.hash(registerDto.password, 12);

    const user = this.usersRepository.create({
      email: registerDto.email,
      phoneNumber: registerDto.phoneNumber,
      fullName: registerDto.fullName,
      userType: registerDto.userType,
      profilePhotoUrl: registerDto.profilePhotoUrl,
      passwordHash,
      verificationStatus: VerificationStatus.PENDING,
    });
    await this.usersRepository.save(user);

    // Generate email verification OTP
    const otp = this.generateOtp();
    user.emailOtp = otp;
    user.emailOtpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await this.usersRepository.save(user);

    // Send OTP via Email
    try {
      await this.mailService.sendOtpEmail(user.email, {
        otp,
        userName: user.fullName,
        purpose: "registration",
      });
      console.log(`✅ OTP email sent to ${user.email}`);
    } catch (error) {
      console.error("❌ Failed to send OTP email:", error);
    }

    await this.notificationsService.createNotification({
      userId: user.id,
      type: NotificationType.SYSTEM,
      title: "Welcome to the Real Estate Platform",
      message: `Hello ${user.fullName}! Your account has been successfully created as a ${user.userType}.`,
      channel: NotificationChannel.IN_APP,
    });

    // Notification for admin about a new user registration
    const adminUsers = await this.usersRepository.find({
      where: { userType: UserType.ADMIN },
    });

    if (adminUsers.length > 0) {
      await this.notificationsService.createNotification({
        userId: adminUsers[0].id,
        type: NotificationType.SYSTEM,
        title: "New User Registered",
        message: `A new user named ${user.fullName} has registered on the platform.`,
        channel: NotificationChannel.IN_APP,
      });
    }

    return {
      message:
        "Registration successful. We sent a verification code to your email.",
    };
  }

  async verifyOtp({
    email,
    otp,
  }: VerifyOtpDto): Promise<{ accessToken: string; refreshToken: string }> {
    const user: any = await this.usersRepository.findOne({ where: { email } });

    if (
      !user ||
      user.emailOtp !== otp ||
      !user.emailOtpExpiresAt ||
      user.emailOtpExpiresAt < new Date()
    ) {
      throw new UnauthorizedException("Invalid or expired OTP");
    }

    user.emailOtp = null;
    user.emailOtpExpiresAt = null;
    user.verificationStatus = VerificationStatus.VERIFIED;
    user.verifiedAt = new Date();
    await this.usersRepository.save(user);

    try {
      await this.mailService.sendWelcomeEmail(user.email, {
        userName: user.fullName,
        userType: user.userType,
      });
    } catch (error) {
      console.error("❌ Failed to send welcome email:", error);
    }

    await this.notificationsService.createNotification({
      userId: user.id,
      type: NotificationType.SYSTEM,
      title: "Your Account Has Been Verified",
      message:
        "Congratulations! Your account has been successfully verified and you can now access all platform features.",
      channel: NotificationChannel.IN_APP,
    });

    return this.generateTokens(user);
  }

  async login({
    email,
    password,
  }: LoginDto): Promise<{ accessToken: string; refreshToken: string }> {
    // Temporary debug logs to help diagnose production login issues (remove after debugging)
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      throw new UnauthorizedException("Invalid credentials");
    }

    if (user.verificationStatus !== VerificationStatus.VERIFIED) {
      throw new UnauthorizedException(
        "Please verify your email before logging in"
      );
    }

    // ✅ Check if account is inactive
    if (user.isActive === false) {
      throw new UnauthorizedException(
        "Your account has been deactivated. Please contact support."
      );
    }

    return this.generateTokens(user);
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      return { message: "If this email exists, a reset code has been sent" };
    }

    const otp = this.generateOtp();
    user.resetOtp = otp;
    user.resetOtpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await this.usersRepository.save(user);

    try {
      await this.mailService.sendOtpEmail(user.email, {
        otp,
        userName: user.fullName,
        purpose: "password_reset",
      });
      console.log(`✅ Password reset OTP email sent to ${user.email}`);
    } catch (error) {
      console.error("❌ Failed to send password reset OTP email:", error);
    }

    return { message: "If this email exists, a reset code has been sent" };
  }

  async resetPassword({
    token,
    newPassword,
  }: ResetPasswordDto): Promise<{ message: string }> {
    const user = await this.usersRepository.findOne({
      where: { resetOtp: token },
    });

    if (
      !user ||
      !user.resetOtpExpiresAt ||
      user.resetOtpExpiresAt < new Date()
    ) {
      throw new UnauthorizedException("Invalid or expired reset token");
    }

    user.passwordHash = await bcrypt.hash(newPassword, 12);
    user.resetOtp = null;
    user.resetOtpExpiresAt = null;
    await this.usersRepository.save(user);

    return { message: "Password reset successfully" };
  }

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private async generateTokens(
    user: User
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = {
      sub: user.id,
      email: user.email,
      userType: user.userType,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: "7d" });

    const authSession = this.authSessionRepository.create({
      user,
      refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    await this.authSessionRepository.save(authSession);

    return { ...user, accessToken, refreshToken };
  }

  async refreshToken(
    refreshToken: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const session = await this.authSessionRepository.findOne({
        where: { refreshToken },
        relations: ["user"],
      });

      if (!session || session.revokedAt || session.expiresAt < new Date()) {
        throw new UnauthorizedException("Invalid refresh token");
      }

      session.revokedAt = new Date();
      await this.authSessionRepository.save(session);

      return this.generateTokens(session.user);
    } catch {
      throw new UnauthorizedException("Invalid refresh token");
    }
  }

  async logout(userId: number): Promise<{ message: string }> {
    await this.authSessionRepository.update(
      { user: { id: userId } },
      { revokedAt: new Date() }
    );
    return { message: "Logged out successfully" };
  }

  async updateProfile(
    userId: number,
    updateProfileDto: UpdateProfileDto
  ): Promise<User> {
    // Prevent email collisions
    if (updateProfileDto.email) {
      const exists = await this.usersRepository.findOne({
        where: { email: updateProfileDto.email },
      });
      if (exists && exists.id !== userId) {
        throw new BadRequestException("Email already in use");
      }
    }

    await this.usersRepository.update(userId, updateProfileDto);
    return this.usersRepository.findOne({ where: { id: userId } });
  }

  async changePassword(
    userId: number,
    { currentPassword, newPassword }: ChangePasswordDto
  ): Promise<{ message: string }> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException("User not found");
    }

    const ok = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!ok) throw new UnauthorizedException("Current password is incorrect");

    user.passwordHash = await bcrypt.hash(newPassword, 12);
    await this.usersRepository.save(user);

    return { message: "Password changed successfully" };
  }

  async getProfile(userId: number): Promise<User> {
    return this.usersRepository.findOne({ where: { id: userId } });
  }

  async validateUser(payload: any): Promise<User> {
    return this.usersRepository.findOne({
      where: { id: payload.sub },
      select: [
        "id",
        "email",
        "phoneNumber",
        "userType",
        "verificationStatus",
        "isActive",
      ],
    });
  }
  async sendLoginOtp({ email }: EmailLoginDto): Promise<{ message: string }> {
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user) throw new NotFoundException("No account found with this email");

    const otp = this.generateOtp();
    user.emailOtp = otp;
    user.emailOtpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await this.usersRepository.save(user);

    try {
      await this.mailService.sendOtpEmail(user.email, {
        otp,
        userName: user.fullName,
        purpose: "login",
      });
    } catch (error) {
      console.error("❌ Failed to send login OTP email:", error);
    }

    return { message: "A login code has been sent to your email." };
  }

  async verifyLoginOtp({
    email,
    otp,
  }: VerifyEmailOtpDto): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const user = await this.usersRepository.findOne({ where: { email } });

    if (
      !user ||
      !user.emailOtp ||
      user.emailOtp !== otp ||
      user.emailOtpExpiresAt < new Date()
    ) {
      throw new UnauthorizedException("Invalid or expired OTP");
    }

    user.emailOtp = null;
    user.emailOtpExpiresAt = null;
    await this.usersRepository.save(user);

    if (user.verificationStatus !== VerificationStatus.VERIFIED) {
      user.verificationStatus = VerificationStatus.VERIFIED;
      user.verifiedAt = new Date();
      await this.usersRepository.save(user);
    }

    if (user.isActive === false) {
      throw new UnauthorizedException("Your account has been deactivated.");
    }

    return this.generateTokens(user);
  }
}
