import nodemailer, { Transporter } from "nodemailer";
import { IEmailService } from "../../application/port/IEmailService";
import { emailTransporter } from "../config/email.config";

export class NodemailerEmailService implements IEmailService {

  constructor(
    private readonly transporter: Transporter = emailTransporter
  ) {}

  async sendResetPasswordEmail(
    to: string,
    resetLink: string
  ): Promise<void> {
    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject: "Reset your password",
      html: `
        <p>Hello,</p>
        <p>You requested a password reset.</p>
        <p>
          <a href="${resetLink}">Click here to reset your password</a>
        </p>
        <p>This link will expire in 15 minutes.</p>
        <p>If you didn’t request this, you can safely ignore this email.</p>
      `,
    });
  }
}
