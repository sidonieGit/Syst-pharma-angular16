import { Utilisateur } from './utilisateur';

export class AgentPharmacie extends Utilisateur {
  matriculePharmacie: string;

  constructor(
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    password: string,
    matriculePharmacie: string
  ) {
    super(firstName, lastName, email, phone, password, 'Agent');
    this.matriculePharmacie = matriculePharmacie;
  }
}
