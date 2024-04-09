import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

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
}
