export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category?: string;
  quantity?: number;
  pharmacyId: number; // ID de la pharmacie à laquelle appartient le produit
}
