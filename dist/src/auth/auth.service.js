"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const global_entity_1 = require("../entities/global.entity");
const nodemailer_1 = require("../../common/nodemailer");
const bcrypt = require("bcryptjs");
const notifications_service_1 = require("../notifications/notifications.service");
let AuthService = class AuthService {
    constructor(usersRepository, authSessionRepository, jwtService, mailService, notificationsService) {
        this.usersRepository = usersRepository;
        this.authSessionRepository = authSessionRepository;
        this.jwtService = jwtService;
        this.mailService = mailService;
        this.notificationsService = notificationsService;
    }
    async register(registerDto) {
        const existingUser = await this.usersRepository.findOne({
            where: [{ email: registerDto.email }, ...(registerDto.phoneNumber ? [{ phoneNumber: registerDto.phoneNumber }] : [])],
        });
        if (existingUser) {
            throw new common_1.ConflictException('User with this email (or phone) already exists');
        }
        const passwordHash = await bcrypt.hash(registerDto.password, 12);
        const user = this.usersRepository.create({
            email: registerDto.email,
            phoneNumber: registerDto.phoneNumber,
            fullName: registerDto.fullName,
            userType: registerDto.userType,
            profilePhotoUrl: registerDto.profilePhotoUrl,
            passwordHash,
            verificationStatus: global_entity_1.VerificationStatus.PENDING,
        });
        await this.usersRepository.save(user);
        const otp = this.generateOtp();
        user.emailOtp = otp;
        user.emailOtpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
        await this.usersRepository.save(user);
        try {
            await this.mailService.sendOtpEmail(user.email, {
                otp,
                userName: user.fullName,
                purpose: 'registration',
            });
            console.log(`✅ OTP email sent to ${user.email}`);
        }
        catch (error) {
            console.error('❌ Failed to send OTP email:', error);
        }
        await this.notificationsService.createNotification({
            userId: user.id,
            type: global_entity_1.NotificationType.SYSTEM,
            title: 'Welcome to the Real Estate Platform',
            message: `Hello ${user.fullName}! Your account has been successfully created as a ${user.userType}.`,
            channel: global_entity_1.NotificationChannel.IN_APP,
        });
        const adminUsers = await this.usersRepository.find({
            where: { userType: global_entity_1.UserType.ADMIN },
        });
        if (adminUsers.length > 0) {
            await this.notificationsService.createNotification({
                userId: adminUsers[0].id,
                type: global_entity_1.NotificationType.SYSTEM,
                title: 'New User Registered',
                message: `A new user named ${user.fullName} has registered on the platform.`,
                channel: global_entity_1.NotificationChannel.IN_APP,
            });
        }
        return {
            message: 'Registration successful. We sent a verification code to your email.',
        };
    }
    async verifyOtp({ email, otp }) {
        const user = await this.usersRepository.findOne({ where: { email } });
        if (!user || user.emailOtp !== otp || !user.emailOtpExpiresAt || user.emailOtpExpiresAt < new Date()) {
            throw new common_1.UnauthorizedException('Invalid or expired OTP');
        }
        user.emailOtp = null;
        user.emailOtpExpiresAt = null;
        user.verificationStatus = global_entity_1.VerificationStatus.VERIFIED;
        user.verifiedAt = new Date();
        await this.usersRepository.save(user);
        try {
            await this.mailService.sendWelcomeEmail(user.email, {
                userName: user.fullName,
                userType: user.userType,
            });
        }
        catch (error) {
            console.error('❌ Failed to send welcome email:', error);
        }
        await this.notificationsService.createNotification({
            userId: user.id,
            type: global_entity_1.NotificationType.SYSTEM,
            title: 'Your Account Has Been Verified',
            message: 'Congratulations! Your account has been successfully verified and you can now access all platform features.',
            channel: global_entity_1.NotificationChannel.IN_APP,
        });
        return this.generateTokens(user);
    }
    async login({ email, password }) {
        const user = await this.usersRepository.findOne({ where: { email } });
        if (!user || !user.passwordHash) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (user.verificationStatus !== global_entity_1.VerificationStatus.VERIFIED) {
            throw new common_1.UnauthorizedException('Please verify your email before logging in');
        }
        if (user.isActive === false) {
            throw new common_1.UnauthorizedException('Your account has been deactivated. Please contact support.');
        }
        return this.generateTokens(user);
    }
    async forgotPassword(email) {
        const user = await this.usersRepository.findOne({ where: { email } });
        if (!user) {
            return { message: 'If this email exists, a reset code has been sent' };
        }
        const otp = this.generateOtp();
        user.resetOtp = otp;
        user.resetOtpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
        await this.usersRepository.save(user);
        try {
            await this.mailService.sendOtpEmail(user.email, {
                otp,
                userName: user.fullName,
                purpose: 'password_reset',
            });
            console.log(`✅ Password reset OTP email sent to ${user.email}`);
        }
        catch (error) {
            console.error('❌ Failed to send password reset OTP email:', error);
        }
        return { message: 'If this email exists, a reset code has been sent' };
    }
    async resetPassword({ token, newPassword }) {
        const user = await this.usersRepository.findOne({ where: { resetOtp: token } });
        if (!user || !user.resetOtpExpiresAt || user.resetOtpExpiresAt < new Date()) {
            throw new common_1.UnauthorizedException('Invalid or expired reset token');
        }
        user.passwordHash = await bcrypt.hash(newPassword, 12);
        user.resetOtp = null;
        user.resetOtpExpiresAt = null;
        await this.usersRepository.save(user);
        return { message: 'Password reset successfully' };
    }
    generateOtp() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
    async generateTokens(user) {
        const payload = {
            sub: user.id,
            email: user.email,
            userType: user.userType,
        };
        const accessToken = this.jwtService.sign(payload);
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
        const authSession = this.authSessionRepository.create({
            user,
            refreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });
        await this.authSessionRepository.save(authSession);
        return { ...user, accessToken, refreshToken };
    }
    async refreshToken(refreshToken) {
        try {
            const payload = this.jwtService.verify(refreshToken);
            const session = await this.authSessionRepository.findOne({
                where: { refreshToken },
                relations: ['user'],
            });
            if (!session || session.revokedAt || session.expiresAt < new Date()) {
                throw new common_1.UnauthorizedException('Invalid refresh token');
            }
            session.revokedAt = new Date();
            await this.authSessionRepository.save(session);
            return this.generateTokens(session.user);
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
    async logout(userId) {
        await this.authSessionRepository.update({ user: { id: userId } }, { revokedAt: new Date() });
        return { message: 'Logged out successfully' };
    }
    async updateProfile(userId, updateProfileDto) {
        if (updateProfileDto.email) {
            const exists = await this.usersRepository.findOne({ where: { email: updateProfileDto.email } });
            if (exists && exists.id !== userId) {
                throw new common_1.BadRequestException('Email already in use');
            }
        }
        await this.usersRepository.update(userId, updateProfileDto);
        return this.usersRepository.findOne({ where: { id: userId } });
    }
    async changePassword(userId, { currentPassword, newPassword }) {
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (!user || !user.passwordHash) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const ok = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!ok)
            throw new common_1.UnauthorizedException('Current password is incorrect');
        user.passwordHash = await bcrypt.hash(newPassword, 12);
        await this.usersRepository.save(user);
        return { message: 'Password changed successfully' };
    }
    async getProfile(userId) {
        return this.usersRepository.findOne({ where: { id: userId } });
    }
    async validateUser(payload) {
        return this.usersRepository.findOne({
            where: { id: payload.sub },
            select: ['id', 'email', 'phoneNumber', 'userType', 'verificationStatus', 'isActive'],
        });
    }
    async sendLoginOtp({ email }) {
        const user = await this.usersRepository.findOne({ where: { email } });
        if (!user)
            throw new common_1.NotFoundException('No account found with this email');
        const otp = this.generateOtp();
        user.emailOtp = otp;
        user.emailOtpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
        await this.usersRepository.save(user);
        try {
            await this.mailService.sendOtpEmail(user.email, {
                otp,
                userName: user.fullName,
                purpose: 'login',
            });
        }
        catch (error) {
            console.error('❌ Failed to send login OTP email:', error);
        }
        return { message: 'A login code has been sent to your email.' };
    }
    async verifyLoginOtp({ email, otp }) {
        const user = await this.usersRepository.findOne({ where: { email } });
        if (!user || !user.emailOtp || user.emailOtp !== otp || user.emailOtpExpiresAt < new Date()) {
            throw new common_1.UnauthorizedException('Invalid or expired OTP');
        }
        user.emailOtp = null;
        user.emailOtpExpiresAt = null;
        await this.usersRepository.save(user);
        if (user.verificationStatus !== global_entity_1.VerificationStatus.VERIFIED) {
            user.verificationStatus = global_entity_1.VerificationStatus.VERIFIED;
            user.verifiedAt = new Date();
            await this.usersRepository.save(user);
        }
        if (user.isActive === false) {
            throw new common_1.UnauthorizedException('Your account has been deactivated.');
        }
        return this.generateTokens(user);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(global_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(global_entity_1.AuthSession)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService,
        nodemailer_1.MailService,
        notifications_service_1.NotificationsService])
], AuthService);
//# sourceMappingURL=auth.service.js.map