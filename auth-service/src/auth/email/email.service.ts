import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private resend = new Resend('re_jRuC8eca_LCNBAqJg8tf36HTtpBYPDA49');
  constructor() {}

  async sendEmail(email: string) {
    try {
      const data = await this.resend.emails.send({
        from: '',
        to: [email],
        subject: '',
        html: '',
      });
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }
}
