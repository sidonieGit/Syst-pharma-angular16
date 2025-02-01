export class Client {
  id?: number; // Identifiant unique du client
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  phone: string = '';
  district: string = '';
  password: string = '';
  dateDAjout?: Date; // Date d'inscription du client
}
