import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// Interface représentant un article du panier
export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  pharmacyId: number;
  pharmacyName?: string; // Ajout de cette propriété optionnelle
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItems: CartItem[] = [];
  private currentPharmacyId: number | null = null;

  // Subjects pour les mises à jour réactives
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  private cartTotalSubject = new BehaviorSubject<number>(0);
  cartTotal$ = this.cartTotalSubject.asObservable();

  private currentPharmacyIdSubject = new BehaviorSubject<number | null>(null);
  currentPharmacyId$ = this.currentPharmacyIdSubject.asObservable();
  /** Cart Observable permet de récupérer les articles du panier en temps réel */
  private cartTotalQuantitySubject = new BehaviorSubject<number>(0);
  cartTotalQuantity$ = this.cartTotalQuantitySubject.asObservable();

  private cart: {
    id: number;
    name: string;
    price: number;
    quantity: number;
  }[] = [];

  constructor() {
    this.loadCartFromStorage();
  }

  /**
   * Ajoute un article au panier, en vérifiant la pharmacie actuelle.
   */
  addItemToCart(item: CartItem): string {
    if (this.currentPharmacyId && this.currentPharmacyId !== item.pharmacyId) {
      return 'Vous ne pouvez commander qu’auprès d’une seule pharmacie à la fois.';
    }

    if (!this.currentPharmacyId) {
      this.currentPharmacyId = item.pharmacyId;
      this.currentPharmacyIdSubject.next(this.currentPharmacyId);
    }

    const existingItem = this.cartItems.find((i) => i.id === item.id);
    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      this.cartItems.push(item);
    }

    this.updateCartState();
    return 'Produit ajouté au panier avec succès.';
  }
  // Méthode pour mettre à jour la quantité d'un article dans le panier
  updateQuantity(productId: number, quantity: number): void {
    const item = this.cartItems.find((i) => i.id === productId);
    if (item) {
      item.quantity = quantity;
      this.updateCartState();
    }
  }
  /**
   * Supprime un article spécifique du panier.
   */
  removeItemFromCart(itemId: number): void {
    this.cartItems = this.cartItems.filter((item) => item.id !== itemId);

    if (this.cartItems.length === 0) {
      this.clearCart();
    } else {
      this.updateCartState();
    }
  }

  /**
   * Vide complètement le panier et réinitialise la pharmacie.
   */
  clearCart(): void {
    this.cartItems = [];
    this.currentPharmacyId = null;
    this.currentPharmacyIdSubject.next(null);
    this.updateCartState();
  }

  /**
   * Retourne tous les articles du panier.
   */
  getCartItems(): CartItem[] {
    return [...this.cartItems];
  }

  /**
   * Retourne le total du panier.
   */
  getCartTotal(): number {
    return this.cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  /**
   * Retourne le nombre total de produits dans le panier */

  getCartTotalQuantity(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  /**
   * Met à jour les états globaux et sauvegarde dans le stockage local. */
  private updateCartState(): void {
    this.cartItemsSubject.next([...this.cartItems]);
    this.cartTotalSubject.next(this.getCartTotal());
    this.cartTotalQuantitySubject.next(this.getCartTotalQuantity());
    this.saveCartToStorage();
  }

  /**
   * Retourne l'identifiant actuel de la pharmacie.
   */
  getCurrentPharmacyId(): number | null {
    return this.currentPharmacyId;
  }

  /**
   * Sauvegarde le panier et l'ID de la pharmacie dans le stockage local.
   */
  private saveCartToStorage(): void {
    try {
      localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
      localStorage.setItem(
        'currentPharmacyId',
        JSON.stringify(this.currentPharmacyId)
      );
    } catch (error) {
      console.error(
        'Erreur lors de la sauvegarde dans le stockage local :',
        error
      );
    }
  }

  /**
   * Charge le panier et l'ID de la pharmacie depuis le stockage local.
   */
  private loadCartFromStorage(): void {
    try {
      const savedCart = localStorage.getItem('cartItems');
      const savedPharmacyId = localStorage.getItem('currentPharmacyId');

      if (savedCart) {
        this.cartItems = JSON.parse(savedCart);
      }

      if (savedPharmacyId) {
        this.currentPharmacyId = JSON.parse(savedPharmacyId);
        this.currentPharmacyIdSubject.next(this.currentPharmacyId);
      }

      this.updateCartState();
    } catch (error) {
      console.error(
        'Erreur lors du chargement du panier depuis le stockage local :',
        error
      );
    }
  }
}
