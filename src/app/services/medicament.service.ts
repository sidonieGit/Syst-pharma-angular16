import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PRODUCTS } from '../model/mock-products'; // Assurez-vous d'importer les produits mockés
import { Product } from '../model/product';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly STORAGE_KEY = 'products';
  private products: Product[] = [];

  private searchTerm = new BehaviorSubject<string>('');
  searchTerm$ = this.searchTerm.asObservable();

  constructor() {
    this.loadProducts();
  }
  /**
   *
   * @param term
   */
  setSearchTerm(term: string) {
    this.searchTerm.next(term);
  }
  /**
   * Charge les produits du localStorage et les mock-products
   */
  loadProducts(): void {
    const storedProducts = localStorage.getItem(this.STORAGE_KEY);
    const parsedStoredProducts = storedProducts
      ? JSON.parse(storedProducts)
      : [];

    // Ajout des produits du mock si leur ID n'existe pas dans les produits stockés
    this.products = [...parsedStoredProducts];
    PRODUCTS.forEach((mockProduct) => {
      const exists = this.products.some(
        (product) => product.id === mockProduct.id
      );
      if (!exists) {
        this.products.push(mockProduct);
      }
    });

    // Sauvegarder les produits combinés dans le localStorage
    this.saveProducts();
  }
  /**
   *
   * @returns  produits
   */
  getProducts(): Product[] {
    return this.products;
  }
  /**
   *  sauvegarde les produits dans le localStorage
   */
  saveProducts(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.products));
  }
  /**
   *
   * @param product produit à ajouter
   */
  addProduct(product: Product) {
    const lastId = Math.max(...this.products.map((p) => p.id), 0);
    product.id = lastId + 1;
    this.products.push(product);
    this.saveProducts();
  }
  /**
   *
   * @param updatedProduct produit à mettre à jour
   */
  updateProduct(updatedProduct: Product) {
    const index = this.products.findIndex((p) => p.id === updatedProduct.id);
    if (index !== -1) {
      this.products[index] = updatedProduct;
      this.saveProducts();
    }
  }

  /**
   *
   * @param id de l'id du produit à supprimer
   */

  deleteProduct(id: number) {
    this.products = this.products.filter((p) => p.id !== id);
    this.saveProducts();
  }
}
