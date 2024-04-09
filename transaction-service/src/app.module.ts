import { Module } from '@nestjs/common';
import { TransactionController } from './transaction/transaction.controller';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [TransactionModule],
  controllers: [TransactionController],
  providers: [],
})
export class AppModule {}
