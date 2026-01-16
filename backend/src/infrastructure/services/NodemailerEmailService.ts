import nodemailer, { Transporter } from "nodemailer";
import { IEmailService } from "../../application/port/IEmailService";

export class NodemailerEmailService implements IEmailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: false, // TLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

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
