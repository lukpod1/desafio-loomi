import { Injectable } from '@nestjs/common';
import { EmailRepository } from 'src/auth/repositories/email.repository';

@Injectable()
export class EmailService {
  constructor(private readonly emailRepository: EmailRepository) {}

  async sendEmail(email: string, userId: string) {
    await this.emailRepository.sendMail({
      from: '',
      to: [email],
      subject: '',
      text: '',
      html: `${userId}`,
    });
  }
}
