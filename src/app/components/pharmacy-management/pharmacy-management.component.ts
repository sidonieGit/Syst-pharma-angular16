import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { OrderService } from '../../services/order.service';
import { Order } from '../../model/order';
import { AuthService } from '../../services/auth.service';
import { AgentPharmacie } from '../../model/agent-pharmacie';
import { Product } from 'src/app/model/product';

@Component({
  selector: 'app-pharmacy-management',
  templateUrl: './pharmacy-management.component.html',
  styleUrls: ['./pharmacy-management.component.css'],
})
export class PharmacyManagementComponent implements OnInit {
  products: Product[] = [];
  orders: Order[] = [];
  newProduct: Product = {
    id: 0,
    name: '',
    description: '',
    price: 0,
    image: '',
    categoryId: 0,
    pharmacyId: 0,
    quantity: 0,
  };
  filteredProducts: Product[] = [];
  showAddModal = false;
  activeTab = 'medicaments';
  errorMessage = '';
  editMode = false;
  filtername: string = '';
  agent: AgentPharmacie | null = null;

  constructor(
    private productsService: ProductsService,
    private orderService: OrderService,
    private authService: AuthService
  ) {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && this.authService.isAgentPharmacie(currentUser)) {
      this.agent = currentUser;
    }
  }

  ngOnInit(): void {
    this.loadProducts();
    this.loadOrders();
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  loadProducts(): void {
    if (this.agent) {
      try {
        this.products = this.productsService.getProducts(this.agent.idPharmacy);
        this.updateFilteredProducts();
        console.log('Products chargés:', this.products);
      } catch (error) {
        this.errorMessage = 'Erreur lors du chargement des produits';
        console.error('Error loading products:', error);
      }
    }
  }

  updateFilteredProducts(): void {
    this.filteredProducts = this.products.filter((product) => {
      return product.name.toLowerCase().includes(this.filtername.toLowerCase());
    });
  }

  openAddMedicamentModal(): void {
    this.showAddModal = true;
    this.editMode = false;
  }

  closeAddMedicamentModal(): void {
    this.showAddModal = false;
    this.resetForm();
  }

  saveProduct(): void {
    if (!this.validateProduct(this.newProduct)) {
      return;
    }

    try {
      if (this.agent) {
        this.newProduct.pharmacyId = this.agent.idPharmacy;
        if (this.editMode) {
          this.productsService.updateProduct(this.newProduct);
        } else {
          this.productsService.addProduct(this.newProduct);
        }
        this.loadProducts(); // Recharger la liste
        this.closeAddMedicamentModal();
      }
    } catch (error) {
      this.errorMessage = "Erreur lors de l'ajout/mise à jour du produit";
      console.error('Error saving product:', error);
    }
  }

  editProduct(product: Product): void {
    this.newProduct = { ...product };
    this.showAddModal = true;
    this.editMode = true;
  }

  deleteProduct(id: number): void {
    try {
      this.productsService.deleteProduct(id);
      this.loadProducts(); // Recharger la liste
    } catch (error) {
      this.errorMessage = 'Erreur lors de la suppression du produit';
      console.error('Error deleting product:', error);
    }
  }

  validateProduct(product: Product): boolean {
    if (!product.name?.trim() || !product.price) {
      this.errorMessage = 'Veuillez remplir tous les champs correctement.';
      return false;
    }
    return true;
  }

  resetForm(): void {
    this.newProduct = {
      id: 0,
      name: '',
      description: '',
      price: 0,
      image: '',
      categoryId: 0,
      pharmacyId: 0,
      quantity: 0,
    };
    this.errorMessage = '';
  }

  loadOrders(): void {
    if (this.agent) {
      try {
        this.orders = this.orderService.getOrdersByPharmacy(
          this.agent.idPharmacy
        );
        console.log('Orders chargés:', this.orders);
      } catch (error) {
        this.errorMessage = 'Erreur lors du chargement des commandes';
        console.error('Error loading orders:', error);
      }
    }
  }

  confirmPayment(orderId: number): void {
    try {
      this.orderService.confirmPayment(orderId);
      this.loadOrders(); // Recharger la liste
    } catch (error) {
      this.errorMessage = 'Erreur lors de la confirmation du paiement';
      console.error('Error confirming payment:', error);
    }
  }

  confirmDelivery(orderId: number): void {
    try {
      this.orderService.confirmDelivery(orderId);
      this.loadOrders(); // Recharger la liste
    } catch (error) {
      this.errorMessage = 'Erreur lors de la confirmation de la livraison';
      console.error('Error confirming delivery:', error);
    }
  }
}
