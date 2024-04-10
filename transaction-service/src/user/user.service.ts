import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { TransactionDto } from 'src/dto/transaction.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserByEmail(email: string) {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  async validateUser(transactionDto: TransactionDto): Promise<User[]> {
    return await this.prisma.user.findMany({
      where: {
        OR: [
          { id: transactionDto.senderUserId },
          { id: transactionDto.receiverUserId },
        ],
      },
      include: {
        bankingDetails: true,
      },
    });
  }
}
