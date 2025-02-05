import { Utilisateur } from './utilisateur';
export class Admin extends Utilisateur {
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
