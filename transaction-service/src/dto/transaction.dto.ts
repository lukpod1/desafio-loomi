import { IsNotEmpty, IsString } from 'class-validator';

export class TransactionDto {
  @IsNotEmpty()
  @IsString()
  senderUserId: string;
  @IsNotEmpty()
  @IsString()
  receiverUserId: string;
  @IsNotEmpty()
  amount: number;

  @IsNotEmpty()
  @IsString()
  description: string;
}
