import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import * as bootstrap from 'bootstrap';
import { AuthService } from '../../services/auth.service';
import { CartItem, CartService } from '../../services/cart.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = false;
  userName: string = '';
  UserFirstName: string = 'Utilisateur';

  cartItems: CartItem[] = [];
  cartTotalQuantity: number = 0;
  cartTotal: number = 0;

  currentPharmacyId: number | null = null;
  currentPharmacyName: string = '';

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.closeModal();
      }
    });
  }

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
      if (this.isLoggedIn) {
        this.userName = this.authService.getUserName();
        this.UserFirstName = this.authService.getUserFirstName();
      }
    });

    this.cartService.cartItems$.subscribe((items) => {
      this.cartItems = items;
      this.updatePharmacyInfo();
    });

    this.cartService.cartTotal$.subscribe((total) => {
      this.cartTotal = total;
    });

    this.cartService.cartTotalQuantity$.subscribe((quantity) => {
      this.cartTotalQuantity = quantity;
    });

    this.loadCart();
  }

  /**
   * Charge les articles du panier
   */
  loadCart() {
    this.cartItems = this.cartService.getCartItems();
    this.cartTotal = this.cartService.getCartTotal();
    this.updatePharmacyInfo();
  }

  /**
   * Met à jour les informations de la pharmacie
   */
  updatePharmacyInfo() {
    if (this.cartItems.length > 0) {
      this.currentPharmacyId = this.cartService.getCurrentPharmacyId();
      this.currentPharmacyName = this.cartItems[0]?.pharmacyName || 'Inconnue';
    } else {
      this.currentPharmacyId = null;
      this.currentPharmacyName = '';
    }
  }

  /**
   * Met à jour la quantité d'un article
   */
  updateQuantity(productId: number, quantity: number) {
    const item = this.cartItems.find((i) => i.id === productId);
    if (item) {
      item.quantity = quantity;
      this.currentPharmacyName = this.cartItems[0]?.pharmacyName || 'Inconnue';
      this.loadCart();
    }
  }

  /**
   * Retire un produit du panier
   */
  removeItem(productId: number) {
    this.cartService.removeItemFromCart(productId);
    this.loadCart();
  }

  /**
   * Vide le panier
   */
  clearCart() {
    this.cartService.clearCart();
    this.loadCart();
  }

  /**
   * Passe une commande
   */
  commander() {
    if (this.isLoggedIn && this.cartItems.length > 0) {
      console.log(
        'Commande passée auprès de la pharmacie :',
        this.currentPharmacyName
      );
      this.cartService.clearCart();
      this.closeModal();
    }
  }

  logout(): void {
    this.authService.logout();
    this.userName = '';
    this.isLoggedIn = false;
    this.router.navigate(['/']);
  }

  redirectToLogin() {
    this.router.navigate(['/login']);
    this.closeModal();
  }

  redirectToProducts() {
    this.router.navigate(['/products']);
    this.closeModal();
  }

  closeModal() {
    const modalElement = document.getElementById('cartModal');
    if (modalElement) {
      const modalInstance =
        bootstrap.Modal.getInstance(modalElement) ||
        new bootstrap.Modal(modalElement);
      modalInstance.hide();
    }

    const backdrops = document.querySelectorAll('.modal-backdrop');
    backdrops.forEach((backdrop) => backdrop.remove());

    document.body.classList.remove('modal-open');
    document.body.style.paddingRight = '';
  }
}
