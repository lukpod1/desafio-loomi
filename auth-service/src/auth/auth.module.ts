import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EmailService } from './services/email/email.service';
import { SESProvider } from './services/email/ses.provider';
import { CacheService } from './services/cache/cache.service';
import { UserService } from './services/user/user.service';
import { PrismaService } from './services/prisma/prisma.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AuthController],
  providers: [
    AuthService,
    CacheService,
    EmailService,
    SESProvider,
    UserService,
    PrismaService,
  ],
})
export class AuthModule {}
