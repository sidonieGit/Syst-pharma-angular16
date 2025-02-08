import { User } from './user';
export class Admin extends User {
  constructor(
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    password: string
  ) {
    super(firstName, lastName, email, phone, password, 'Admin');
  }
}
