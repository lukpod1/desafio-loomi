import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { User } from '@prisma/client';
import { TransactionDto } from 'src/dto/transaction.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { S3Service } from 'src/s3/s3.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly s3Service: S3Service,
    @Inject('USER_SERVICE')
    private kafkaClient: ClientKafka,
  ) {}

  async getUserDetails(userId: string) {
    return await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        bankingDetails: true,
      },
    });
  }

  async getUserByEmail(email: string) {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  async updateUserDetails(userId: string, updateData: Partial<User>) {
    const user = await this.getUserDetails(userId);
    if (!user) {
      throw new Error('User not found');
    }

    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...updateData,
        updatedAt: new Date(),
      },
      include: {
        bankingDetails: true,
      },
    });
  }

  async updateProfilePicture(userId: string, file: Express.Multer.File) {
    const user = await this.getUserDetails(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const response = await this.s3Service.uploadFile(file);
    return await this.updateUserDetails(userId, {
      profilePicture: response.Location,
    });
  }
  async transferAmount(data: TransactionDto) {
    const { senderUserId, receiverUserId, amount } = data;

    const senderUser = await this.getUserDetails(senderUserId);
    const receiverUser = await this.getUserDetails(receiverUserId);

    if (!senderUser || !receiverUser) {
      throw new Error('User not found');
    }

    const updatedSender = await this.prisma.bankingDetails.update({
      where: { id: senderUserId },
      data: {
        balance: {
          decrement: amount,
        },
      },
    });

    const updatedReceiver = await this.prisma.bankingDetails.update({
      where: { id: receiverUserId },
      data: {
        balance: {
          increment: amount,
        },
      },
    });

    await this.kafkaClient.emit('transactions-response', {
      sender: updatedSender,
      receiver: updatedReceiver,
    });

    return { sender: updatedSender, receiver: updatedReceiver };
  }
}
