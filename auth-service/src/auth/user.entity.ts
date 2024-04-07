export class User {
  id: string;
  name: string;

  email: string;

  salt: string;

  password: string;

  address: string;

  bankingDetails: {
    accounNumber: string;
    agency: string;
    balance: number;
  };

  pictureProfile: string;
}
