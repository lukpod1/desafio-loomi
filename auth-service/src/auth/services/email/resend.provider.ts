import { Resend } from 'resend';
import { EmailData, EmailProvider } from './email.provider.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ResendProvider implements EmailProvider {
  private RESEND_KEY = process.env.RESEND_KEY;
  private client = new Resend(this.RESEND_KEY);

  async sendMail(data: EmailData): Promise<void> {
    await this.client.emails.send({
      from: data.from,
      to: data.to,
      subject: data.subject,
      text: data.text,
    });
  }
}
