import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  async sendOtpEmail(
    userEmail: string,
    data: {
      otp: string;
      userName: string;
      purpose: 'registration' | 'password_reset' | 'login';
    },
  ) {
    const subject = this.getEmailSubject(data.purpose);
    const htmlContent = this.generateOtpTemplate(data);

    await this.transporter.sendMail({
      to: userEmail,
      subject,
      html: htmlContent,
    });
  }

  async sendWelcomeEmail(
    userEmail: string,
    data: {
      userName: string;
      userType: string;
    },
  ) {
    const subject = 'Welcome to Our Real Estate Platform';

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Welcome</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f9f9f9;
            }
            .container {
                background: white;
                border-radius: 10px;
                padding: 30px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                border: 1px solid #e0e0e0;
            }
            .header {
                text-align: center;
                background: linear-gradient(135deg, #1e328b, #2c5aa0);
                color: white;
                padding: 20px;
                border-radius: 10px 10px 0 0;
                margin: -30px -30px 30px -30px;
            }
            .logo {
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 10px;
            }
            .welcome-text {
                font-size: 20px;
                margin-bottom: 20px;
                color: #1e328b;
                text-align: center;
            }
            .user-info {
                background: #f8f9fa;
                padding: 15px;
                border-radius: 8px;
                margin: 20px 0;
                border-left: 4px solid #1e328b;
            }
            .features {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
                margin: 25px 0;
            }
            .feature {
                text-align: center;
                padding: 15px;
                background: #f5f7fa;
                border-radius: 8px;
                border: 1px solid #e0e0e0;
            }
            .feature-icon {
                font-size: 24px;
                margin-bottom: 10px;
                color: #1e328b;
            }
            .footer {
                text-align: center;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #e0e0e0;
                color: #666;
                font-size: 14px;
            }
            .button {
                display: inline-block;
                background: #1e328b;
                color: white;
                padding: 12px 30px;
                text-decoration: none;
                border-radius: 5px;
                margin: 10px 5px;
                font-weight: bold;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">🏠 Real Estate Platform</div>
                <h1>Welcome to Our Family</h1>
            </div>
            
            <div class="welcome-text">
                Hello ${data.userName} 👋
            </div>
            
            <p>We’re delighted to have you on board! Your account as a <strong>${data.userType}</strong> has been successfully activated.</p>
            
            <div class="user-info">
                <strong>Your Account Details:</strong><br>
                - Email: ${userEmail}<br>
                - Account Type: ${data.userType}<br>
                - Registration Date: ${new Date().toLocaleDateString('en-US')}
            </div>

            <div class="features">
                <div class="feature">
                    <div class="feature-icon">🔍</div>
                    <h3>Browse Properties</h3>
                    <p>Explore thousands of listings that match your preferences.</p>
                </div>
                <div class="feature">
                    <div class="feature-icon">📅</div>
                    <h3>Book Appointments</h3>
                    <p>Schedule property viewings quickly and easily.</p>
                </div>
                <div class="feature">
                    <div class="feature-icon">🤝</div>
                    <h3>Trusted Agents</h3>
                    <p>Work with verified and reliable real estate professionals.</p>
                </div>
                <div class="feature">
                    <div class="feature-icon">🛡️</div>
                    <h3>Secure Service</h3>
                    <p>Enjoy safe transactions and guaranteed protection.</p>
                </div>
            </div>

            <div style="text-align: center;">
                <a href="${process.env.FRONTEND_URL}" class="button">Start Your Journey</a>
            </div>

            <div class="footer">
                <p>If you have any questions, feel free to reach out:</p>
                <p>📞 ${process.env.SUPPORT_PHONE || '+966500000000'}</p>
                <p>✉️ ${process.env.SUPPORT_EMAIL || 'support@realestate.com'}</p>
                <p>© 2024 Real Estate Platform. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;

    await this.transporter.sendMail({
      to: userEmail,
      subject,
      html: htmlContent,
    });
  }

  private getEmailSubject(purpose: string): string {
    const subjects = {
      registration: 'Verification Code - New Registration',
      password_reset: 'Password Reset Code',
      login: 'Login Verification Code',
    };
    return subjects[purpose] || 'Verification Code';
  }

  private generateOtpTemplate(data: { otp: string; userName: string; purpose: 'registration' | 'password_reset' | 'login' }): string {
    const purposeText = {
      registration: 'Register a New Account',
      password_reset: 'Reset Your Password',
      login: 'Login to Your Account',
    };

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Verification Code</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f9f9f9;
            }
            .container {
                background: white;
                border-radius: 10px;
                padding: 30px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                border: 1px solid #e0e0e0;
            }
            .header {
                text-align: center;
                background: linear-gradient(135deg, #1e328b, #2c5aa0);
                color: white;
                padding: 20px;
                border-radius: 10px 10px 0 0;
                margin: -30px -30px 30px -30px;
            }
            .otp-code {
                background: linear-gradient(135deg, #1e328b, #2c5aa0);
                color: white;
                font-size: 32px;
                font-weight: bold;
                padding: 20px;
                text-align: center;
                border-radius: 8px;
                margin: 20px 0;
                letter-spacing: 8px;
                font-family: 'Courier New', monospace;
            }
            .warning {
                background: #fff3cd;
                border: 1px solid #ffeaa7;
                color: #856404;
                padding: 15px;
                border-radius: 5px;
                margin: 20px 0;
                text-align: center;
            }
            .footer {
                text-align: center;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #e0e0e0;
                color: #666;
                font-size: 14px;
            }
            .purpose-badge {
                display: inline-block;
                background: #e3f2fd;
                color: #1e328b;
                padding: 8px 16px;
                border-radius: 20px;
                font-weight: bold;
                margin: 10px 0;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🏠 Real Estate Platform</h1>
                <p>Secure Verification Code</p>
            </div>
            
            <p>Dear <strong>${data.userName}</strong>,</p>
            
            <div class="purpose-badge">
                ${purposeText[data.purpose]}
            </div>
            
            <p>Please use the verification code below to complete your request:</p>
            
            <div class="otp-code">
                ${data.otp}
            </div>
            
            <div class="warning">
                ⚠️ <strong>Important:</strong><br>
                This code is valid for 10 minutes only.<br>
                Do not share this code with anyone.
            </div>
            
            <p>If you did not request this code, please ignore this message.</p>
            
            <div class="footer">
                <p>Best regards,<br>The Real Estate Platform Team 🏠</p>
                <p>📞 ${process.env.SUPPORT_PHONE || '+966500000000'} | ✉️ ${process.env.SUPPORT_EMAIL || 'support@realestate.com'}</p>
                <p>© 2024 Real Estate Platform. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('✅ Email server connection established');
      return true;
    } catch (error) {
      console.error('❌ Email server connection failed:', error);
      return false;
    }
  }
}
