import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisOptions } from './configs/redis-options.constants';
import { ConfigModule } from '@nestjs/config';
import { EmailService } from './services/email/email.service';
import { ResendProvider } from './services/email/resend.provider';

@Module({
  imports: [ConfigModule.forRoot(), CacheModule.registerAsync(RedisOptions)],
  controllers: [AuthController],
  providers: [AuthService, EmailService, ResendProvider],
})
export class AuthModule {}
