export class User {
  id: string;
  name: string;

  email: string;

  salt: string;

  password: string;

  address: string;

  bankingDetails: {
    accountNumber: string;
    agency: string;
    balance: number;
  };
}
