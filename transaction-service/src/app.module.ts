import { Module } from '@nestjs/common';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [TransactionModule],
  providers: [],
})
export class AppModule {}
