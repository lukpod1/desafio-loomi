import { Injectable } from '@nestjs/common';
import { EmailProvider } from './email.provider.interface';
import { ResendProvider } from './resend.provider';

@Injectable()
export class EmailService {
  private readonly provider: EmailProvider;

  constructor() {
    if (process.env.EMAIL_PROVIDER === 'resend') {
      this.provider = new ResendProvider();
    }
  }

  async sendEmail(email: string, userId: string) {
    this.provider
      .sendMail({
        from: process.env.EMAIL_DOMAIN,
        to: email,
        subject: 'Confirm your email',
        html: `<a href="http://localhost:3000/auth/confirm/${userId}">Click here to confirm your email</a>`,
      })
      .then((res) => {
        console.log('Email sent', res);
      })
      .catch((error) => {
        console.error('Error sending email', error);
      });
  }
}
