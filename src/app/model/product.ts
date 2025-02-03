export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: number; // ID de la catégorie auquelle appartient le produit
  quantity?: number;
  pharmacyId: number; // ID de la pharmacie à laquelle appartient le produit
}
