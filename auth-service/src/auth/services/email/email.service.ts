import { Injectable } from '@nestjs/common';
import { EmailProvider } from './email.provider.interface';
import { SESProvider } from './ses.provider';

@Injectable()
export class EmailService {
  private readonly provider: EmailProvider;

  constructor() {
    this.provider = new SESProvider();
  }

  async sendEmail(email: string, token: string) {
    await this.provider.sendMail({
      from: process.env.EMAIL_DOMAIN,
      to: email,
      subject: 'Confirm your email',
      html: `<a href="http://localhost:3000/auth/confirm/${encodeURIComponent(token)}">Click here to confirm your email</a>`,
    });
  }
}
