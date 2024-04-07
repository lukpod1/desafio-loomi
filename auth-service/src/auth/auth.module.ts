import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CacheModule } from '@nestjs/cache-manager';
import { EmailService } from './email/email.service';
import { RedisOptions } from './configs/redis-options.constants';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), CacheModule.registerAsync(RedisOptions)],
  controllers: [AuthController],
  providers: [AuthService, EmailService],
})
export class AuthModule {}
