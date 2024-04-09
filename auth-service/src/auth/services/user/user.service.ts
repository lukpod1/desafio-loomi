import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import { SignInDto } from 'src/auth/dto/signin.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return await this.prisma.user.create({ data });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  async validateUserPassword(signInDto: SignInDto): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { email: signInDto.email },
    });

    const hash = await bcrypt.hash(signInDto.password, user.salt);
    if (user && hash === user.password) {
      return user;
    } else {
      throw new NotFoundException('Invalid credentials');
    }
  }
}
