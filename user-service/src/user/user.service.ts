import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserDetails(userId: string) {
    return await this.prisma.user.findUnique({ where: { id: userId } });
  }
}