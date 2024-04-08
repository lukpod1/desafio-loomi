import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EmailService } from './services/email/email.service';
import { SESProvider } from './services/email/ses.provider';
import { CacheService } from './services/cache/cache.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AuthController],
  providers: [AuthService, CacheService, EmailService, SESProvider],
})
export class AuthModule {}
