import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PrismaService } from './prisma/prisma.service';
import { S3Service } from './s3/s3.service';

@Module({
  imports: [UserModule],
  providers: [PrismaService, S3Service],
})
export class AppModule {}
