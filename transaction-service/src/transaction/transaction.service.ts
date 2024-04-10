import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { User } from '@prisma/client';
import { TransactionResponseDto } from 'src/dto/transaction-response.dto';
import { TransactionDto } from 'src/dto/transaction.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class TransactionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    @Inject('TRANSACTION_SERVICE')
    private kafkaClient: ClientKafka,
  ) {}

  async create(transactionDto: TransactionDto) {
    const users = await this.userService.validateUser(transactionDto);
    if (!users) {
      throw new Error('Users not found');
    }

    const sender: User & { BankingDetails?: { balance: number } } = users.find(
      (user) => user.id === transactionDto.senderUserId,
    );

    if (sender?.BankingDetails?.balance < transactionDto.amount) {
      throw new Error('Insufficient balance');
    }

    const transaction = await this.prisma.transaction.create({
      data: {
        amount: transactionDto.amount,
        receiverUserId: transactionDto.receiverUserId,
        senderUserId: transactionDto.senderUserId,
        description: transactionDto.description,
      },
    });

    await this.kafkaClient.emit('transactions', transaction);
    console.log('message sent: transactions', transaction);
    return transaction;
  }

  async getTransaction(id: string) {
    return await this.prisma.transaction.findUnique({
      where: { id },
    });
  }

  async getTransactionBySenderUserId(senderUserId: string) {
    return await this.prisma.transaction.findMany({
      where: { senderUserId },
    });
  }

  async consumer(message: TransactionResponseDto) {
    const transaction = await this.prisma.transaction.update({
      where: { id: message.sender.id },
      data: {
        status: 'COMPLETED',
        updatedAt: new Date(),
      },
    });

    console.log(
      `message consumida: ${message}, updated: transaction ${transaction}`,
    );

    return transaction;
  }
}
