export interface IEmailService {
    sendResetPasswordEmail(
      to: string,
      resetLink: string
    ): Promise<void>
  }
  