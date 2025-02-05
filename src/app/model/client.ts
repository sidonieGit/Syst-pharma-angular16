import { Utilisateur } from './utilisateur';

export class Client extends Utilisateur {
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
