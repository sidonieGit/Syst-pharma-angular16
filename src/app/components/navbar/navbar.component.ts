import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import * as bootstrap from 'bootstrap';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { CartItem, CartService } from '../../services/cart.service';
import { ProductsService } from '../../services/medicament.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  // Auth related variables
  isLoggedIn: boolean = false;
  userName: string = '';
  UserFirstName: string = 'Utilisateur';

  // Search related variables
  searchTerm: string = '';

  // Cart related variables
  cartItems: CartItem[] = [];
  cartTotalQuantity: number = 0;
  cartTotal: number = 0;
  currentPharmacyId: number | null = null;
  currentPharmacyName: string = '';

  // Modal and subscription management
  private modalInstance: any;
  private subscriptions: Subscription[] = [];
  private modalElement: HTMLElement | null = null;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router,
    private productsService: ProductsService,
    private notificationService: NotificationService
  ) {
    // Subscribe to router events for modal management
    this.subscriptions.push(
      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe(() => {
          this.forceCleanupModal();
        })
    );
  }

  ngOnInit(): void {
    // Force cleanup any existing modal effects
    this.forceCleanupModal();

    // Initialize modal
    this.initializeModal();

    // Subscribe to auth status
    this.subscriptions.push(
      this.authService.isLoggedIn$.subscribe((status) => {
        this.isLoggedIn = status;
        if (this.isLoggedIn) {
          this.userName = this.authService.getUserName();
          this.UserFirstName = this.authService.getUserFirstName();
        }
      })
    );

    // Subscribe to cart updates
    this.subscriptions.push(
      this.cartService.cartItems$.subscribe((items) => {
        this.cartItems = items;
        this.updatePharmacyInfo();
      }),
      this.cartService.cartTotal$.subscribe((total) => {
        this.cartTotal = total;
      }),
      this.cartService.cartTotalQuantity$.subscribe((quantity) => {
        this.cartTotalQuantity = quantity;
      })
    );

    // Initial cart load
    this.loadCart();
  }

  ngOnDestroy(): void {
    // Cleanup subscriptions
    this.subscriptions.forEach((sub) => sub.unsubscribe());

    // Cleanup modal
    if (this.modalInstance) {
      this.modalInstance.dispose();
    }
    this.forceCleanupModal();
  }

  private initializeModal(): void {
    this.modalElement = document.getElementById('cartModal');
    if (this.modalElement) {
      // Initialize Bootstrap modal with options
      this.modalInstance = new bootstrap.Modal(this.modalElement, {
        backdrop: true,
        keyboard: true,
      });

      // Add event listener for modal hidden event
      this.modalElement.addEventListener('hidden.bs.modal', () => {
        this.forceCleanupModal();
      });
    }
  }

  private forceCleanupModal(): void {
    // Force remove all modal-related classes and styles
    document.body.classList.remove('modal-open');
    document.body.style.removeProperty('padding-right');
    document.body.style.removeProperty('overflow');
    document.body.style.overflow = 'auto';

    // Remove backdrop if it exists
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
      backdrop.remove();
    }

    // Reset any inline styles that Bootstrap might have added
    const modalElement = document.getElementById('cartModal');
    if (modalElement) {
      modalElement.style.display = 'none';
      modalElement.classList.remove('show');
      modalElement.setAttribute('aria-hidden', 'true');
      modalElement.removeAttribute('aria-modal');
      modalElement.removeAttribute('role');
    }
  }

  // Rest of your component methods...
  updateFilteredProducts(): void {
    this.productsService.setSearchTerm(this.searchTerm);
  }

  loadCart(): void {
    this.cartItems = this.cartService.getCartItems();
    this.cartTotal = this.cartService.getCartTotal();
    this.updatePharmacyInfo();
  }

  updatePharmacyInfo(): void {
    if (this.cartItems.length > 0) {
      this.currentPharmacyId = this.cartService.getCurrentPharmacyId();
      this.currentPharmacyName = this.cartItems[0]?.pharmacyName || 'Inconnue';
    } else {
      this.currentPharmacyId = null;
      this.currentPharmacyName = '';
    }
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity > 0) {
      this.cartService.updateQuantity(productId, quantity);
      this.loadCart();
    }
  }

  removeItem(productId: number): void {
    this.cartService.removeItemFromCart(productId);
    this.loadCart();
  }

  clearCart(): void {
    this.cartService.clearCart();
    this.loadCart();
  }

  commander(): void {
    if (this.isLoggedIn && this.cartItems.length > 0) {
      console.log(
        'Commande passée auprès de la pharmacie :',
        this.currentPharmacyName
      );
      this.cartService.clearCart();
      this.closeModalAndNavigate();
    }
  }

  logout(): void {
    this.authService.logout();
    this.userName = '';
    this.UserFirstName = 'Utilisateur';
    this.isLoggedIn = false;
    this.router.navigate(['/']);
    // Remplacer l'alert par la notification
    this.notificationService.show('Déconnexion réussie!', 'success');
  }

  redirectToLogin(): void {
    this.closeModalAndNavigate('/login');
  }

  redirectToProducts(): void {
    this.closeModalAndNavigate('/products');
  }

  private closeModalAndNavigate(route?: string): void {
    if (this.modalInstance) {
      this.modalInstance.hide();

      setTimeout(() => {
        this.forceCleanupModal();
        if (route) {
          this.router.navigate([route]).then(() => {
            // Force cleanup again after navigation
            setTimeout(() => {
              this.forceCleanupModal();
            }, 100);
          });
        }
      }, 150);
    } else if (route) {
      this.router.navigate([route]);
    }
  }

  closeModal(): void {
    if (this.modalInstance) {
      this.modalInstance.hide();
      setTimeout(() => {
        this.forceCleanupModal();
      }, 150);
    }
  }

  showModal(): void {
    if (this.modalInstance) {
      this.modalInstance.show();
    }
  }
}
