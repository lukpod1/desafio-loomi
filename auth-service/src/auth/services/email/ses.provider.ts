import { SES } from 'aws-sdk';
import { EmailData, EmailProvider } from './email.provider.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SESProvider implements EmailProvider {
  private client = new SES({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });

  async sendMail(data: EmailData): Promise<void> {
    try {
      const result = await this.client
        .sendEmail({
          Source: process.env.EMAIL_DOMAIN,
          Destination: {
            ToAddresses: [data.to],
          },
          Message: {
            Body: {
              Html: {
                Data: data.html,
              },
            },
            Subject: {
              Data: data.subject,
            },
          },
        })
        .promise();
      console.log('Email sent', result);
    } catch (error) {
      console.log('Error sending email', error);
    }
  }
}
