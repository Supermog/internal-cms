import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'node-mailjet';

export interface SendEmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private mailjetClient: Client | null = null;
  private fromEmail: string;
  private fromName: string;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('MAILJET_API_KEY');
    const secretKey = this.configService.get<string>('MAILJET_SECRET_KEY');
    this.fromEmail =
      this.configService.get<string>('MAILJET_FROM_EMAIL') ||
      'noreply@example.com';
    this.fromName =
      this.configService.get<string>('MAILJET_FROM_NAME') || 'Internal CMS';

    if (apiKey && secretKey) {
      this.mailjetClient = new Client({
        apiKey,
        apiSecret: secretKey,
      });
    } else {
      this.logger.warn(
        'MAILJET_API_KEY or MAILJET_SECRET_KEY not configured. Email sending is disabled.',
      );
    }
  }

  async sendEmail(options: SendEmailOptions): Promise<void> {
    if (!this.mailjetClient) {
      this.logger.warn(
        `Email not sent (Mailjet not configured): ${options.subject} to ${options.to}`,
      );
      return;
    }

    try {
      await this.mailjetClient.post('send', { version: 'v3.1' }).request({
        Messages: [
          {
            From: {
              Email: this.fromEmail,
              Name: this.fromName,
            },
            To: [
              {
                Email: options.to,
              },
            ],
            Subject: options.subject,
            TextPart: options.text,
            HTMLPart: options.html,
          },
        ],
      });
      this.logger.log(`Email sent successfully to ${options.to}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${options.to}`, error);
      throw error;
    }
  }

  async sendInviteEmail(
    to: string,
    inviteCode: string,
    inviteeName: string,
  ): Promise<void> {
    const frontendUrl =
      this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173';
    const signUpUrl = `${frontendUrl}/sign-up?code=${inviteCode}`;

    const subject = "You've been invited to join Internal CMS";
    const text = `
Hello ${inviteeName},

You have been invited to join Internal CMS.

Click the link below to create your account:
${signUpUrl}

This invitation will expire in 7 days.

If you did not expect this invitation, you can safely ignore this email.

Best regards,
The Internal CMS Team
    `.trim();

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #f9fafb; border-radius: 8px; padding: 32px; text-align: center;">
    <h1 style="color: #111827; margin-bottom: 16px;">You're Invited!</h1>
    <p style="color: #6b7280; margin-bottom: 24px;">
      Hello <strong>${inviteeName}</strong>,<br><br>
      You have been invited to join <strong>Internal CMS</strong>.
    </p>
    <a href="${signUpUrl}" style="display: inline-block; background-color: #2563eb; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 500; margin-bottom: 24px;">
      Create Your Account
    </a>
    <p style="color: #9ca3af; font-size: 14px; margin-top: 24px;">
      This invitation will expire in 7 days.
    </p>
    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">
    <p style="color: #9ca3af; font-size: 12px;">
      If you did not expect this invitation, you can safely ignore this email.
    </p>
  </div>
</body>
</html>
    `.trim();

    await this.sendEmail({ to, subject, text, html });
  }
}
