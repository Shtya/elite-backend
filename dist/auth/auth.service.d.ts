import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User, AuthSession } from 'src/entities/global.entity';
import { LoginDto, RegisterDto, VerifyOtpDto, ChangePasswordDto, ResetPasswordDto, UpdateProfileDto, EmailLoginDto, VerifyEmailOtpDto } from '../dto/auth.dto';
import { MailService } from 'common/nodemailer';
import { NotificationsService } from 'src/notifications/notifications.service';
export declare class AuthService {
    private usersRepository;
    private authSessionRepository;
    private jwtService;
    private mailService;
    private notificationsService;
    constructor(usersRepository: Repository<User>, authSessionRepository: Repository<AuthSession>, jwtService: JwtService, mailService: MailService, notificationsService: NotificationsService);
    register(registerDto: RegisterDto): Promise<{
        message: string;
    }>;
    verifyOtp({ email, otp }: VerifyOtpDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    login({ email, password }: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
    resetPassword({ token, newPassword }: ResetPasswordDto): Promise<{
        message: string;
    }>;
    private generateOtp;
    private generateTokens;
    refreshToken(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(userId: number): Promise<{
        message: string;
    }>;
    updateProfile(userId: number, updateProfileDto: UpdateProfileDto): Promise<User>;
    changePassword(userId: number, { currentPassword, newPassword }: ChangePasswordDto): Promise<{
        message: string;
    }>;
    getProfile(userId: number): Promise<User>;
    validateUser(payload: any): Promise<User>;
    sendLoginOtp({ email }: EmailLoginDto): Promise<{
        message: string;
    }>;
    verifyLoginOtp({ email, otp }: VerifyEmailOtpDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
}
