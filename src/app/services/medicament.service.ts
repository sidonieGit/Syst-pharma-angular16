import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../model/product';
import { PRODUCTS } from '../model/mock-products'; // Assurez-vous d'importer les produits mockés

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

  setSearchTerm(term: string) {
    this.searchTerm.next(term);
  }

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

  getProducts(): Product[] {
    return this.products;
  }

  saveProducts(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.products));
  }

  addProduct(product: Product) {
    const lastId = Math.max(...this.products.map((p) => p.id), 0);
    product.id = lastId + 1;
    this.products.push(product);
    this.saveProducts();
  }

  updateProduct(updatedProduct: Product) {
    const index = this.products.findIndex((p) => p.id === updatedProduct.id);
    if (index !== -1) {
      this.products[index] = updatedProduct;
      this.saveProducts();
    }
  }

  deleteProduct(id: number) {
    this.products = this.products.filter((p) => p.id !== id);
    this.saveProducts();
  }
}
