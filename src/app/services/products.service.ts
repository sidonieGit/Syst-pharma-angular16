import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../model/product';
import { PRODUCTS } from '../model/mock-products'; // Assurez-vous d'importer les produits mockés
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly STORAGE_KEY = 'products';
  private products: Product[] = [];
  private mockProducts: Product[] = PRODUCTS;

  private searchTerm = new BehaviorSubject<string>('');
  searchTerm$ = this.searchTerm.asObservable();

  constructor(private authService: AuthService) {
    this.loadProducts();
  }

  setSearchTerm(term: string) {
    this.searchTerm.next(term);
  }

  // Charge les produits du localStorage et les mock-products
  loadProducts(): void {
    const storedProducts = localStorage.getItem(this.STORAGE_KEY);
    if (storedProducts) {
      this.products = JSON.parse(storedProducts);
    } else {
      this.products = [];
    }
  }

  // Renvoie tous les produits, en évitant les doublons
  getAllProducts(): Product[] {
    const allProducts = [...this.products];

    // Ajouter les produits mock uniquement si leur ID n'est pas déjà dans les produits stockés
    this.mockProducts.forEach((mockProduct) => {
      const exists = allProducts.some(
        (product) => product.id === mockProduct.id
      );
      if (!exists) {
        allProducts.push(mockProduct);
      }
    });

    return allProducts;
  }

  getProductsForCurrentPharmacy(): Product[] {
    const pharmacyId = this.authService.getCurrentPharmacyId();
    if (!pharmacyId) {
      return [];
    }
    return this.products.filter((product) => product.pharmacyId === pharmacyId);
  }

  getProducts(pharmacyId: number): Product[] {
    return this.products.filter((product) => product.pharmacyId === pharmacyId);
  }

  saveProducts(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.products));
  }

  // addProduct(product: Product) {
  //   const lastId = Math.max(...this.products.map((p) => p.id), 0);
  //   product.id = lastId + 1;
  //   this.products.push(product);
  //   this.saveProducts();
  // }
  addProduct(product: Product) {
    const pharmacyId = this.authService.getCurrentPharmacyId();
    if (!pharmacyId) {
      throw new Error('Pharmacy ID not found for the current agent');
    }
    product.pharmacyId = pharmacyId;
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
