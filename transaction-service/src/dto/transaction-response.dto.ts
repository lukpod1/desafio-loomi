export class TransactionResponseDto {
  sender: UserDto;
  receiver: UserDto;
}

class UserDto {
  id: string;
  email: string;
  name: string;
  password: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
  salt: string;
  profilePicture: string;
  bankingDetails: {
    id: string;
    balance: number;
    createdAt: Date;
    updatedAt: Date;
  };
}
