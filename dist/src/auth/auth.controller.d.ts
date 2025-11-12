import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, VerifyOtpDto, RefreshTokenDto, ChangePasswordDto, ForgotPasswordDto, ResetPasswordDto, UpdateProfileDto, EmailLoginDto, VerifyEmailOtpDto } from '../dto/auth.dto';
import { Request } from 'express';
interface RequestWithUser extends Request {
    user: any;
}
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        message: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    refreshToken(refreshTokenDto: RefreshTokenDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(req: RequestWithUser): Promise<{
        message: string;
    }>;
    updateProfile(req: RequestWithUser, updateProfileDto: UpdateProfileDto): Promise<import("../entities/global.entity").User>;
    changePassword(req: RequestWithUser, changePasswordDto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    getProfile(req: RequestWithUser): Promise<import("../entities/global.entity").User>;
    sendLoginOtp(dto: EmailLoginDto): Promise<{
        message: string;
    }>;
    verifyLoginOtp(dto: VerifyEmailOtpDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
}
export {};
