import Mailgun, { MailgunMessageData } from 'mailgun.js';
import * as FormData from 'form-data';

export class EmailRepository {
  private MAILGUN_KEY = process.env.MAILGUN_KEY;
  private MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN;

  private client = new Mailgun(FormData).client({
    username: 'api',
    key: this.MAILGUN_KEY,
  });

  async sendMail(data: MailgunMessageData) {
    const response = await this.client.messages.create(
      this.MAILGUN_DOMAIN,
      data,
    );
    console.log(response);
  }
}
