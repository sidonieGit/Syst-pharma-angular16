// export interface Order {
//   id: number;
//   status: string;
//   [key: string]: any; // Permet d'ajouter d'autres propriétés si nécessaire
// }
export interface Order {
  id: number;
  clientId: number; // ID du client qui a passé la commande
  productIds: number[]; // IDs des produits dans la commande
  totalAmount: number;
  status: 'Pending' | 'Paid' | 'Delivered'; // Statut de la commande
  pharmacyId: number; // ID de la pharmacie à laquelle appartient la commande
}
