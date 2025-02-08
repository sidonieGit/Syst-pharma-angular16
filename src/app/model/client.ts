import { User } from './user';

export class Client extends User {
  district: string;
  commandNumber: number = 0;

  constructor(
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    password: string,
    district: string
  ) {
    super(firstName, lastName, email, phone, password, 'Client');
    this.district = district;
  }
}
