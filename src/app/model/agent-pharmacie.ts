import { User } from './user';

export class AgentPharmacie extends User {
  matriculePharmacie: string;
  idPharmacy: number; // Ajout de l'identifiant de la pharmacie

  constructor(
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    password: string,
    matriculePharmacie: string,
    idPharmacy: number // Ajout du paramètre idPharmacy
  ) {
    super(firstName, lastName, email, phone, password, 'Agent');
    this.matriculePharmacie = matriculePharmacie;
    this.idPharmacy = idPharmacy; // Initialisation de l'identifiant de la pharmacie
  }
}
