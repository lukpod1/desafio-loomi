import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionDto } from 'src/dto/transaction.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('api/transactions')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Post()
  create(@Body(ValidationPipe) transactionDto: TransactionDto) {
    return this.transactionService.create(transactionDto);
  }

  @Get(':id')
  getTransaction(@Param('id') id: string) {
    return this.transactionService.getTransaction(id);
  }

  @Get('user/:senderUserId')
  getTransactionBySenderUserId(@Param('senderUserId') senderUserId: string) {
    return this.transactionService.getTransactionBySenderUserId(senderUserId);
  }

  @MessagePattern('transactions-response')
  async consumer(@Payload() message) {
    await this.transactionService.consumer(message);
  }
}
