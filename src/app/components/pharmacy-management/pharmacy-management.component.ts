import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { AgentPharmacie } from '../../model/agent-pharmacie';
import { Product } from 'src/app/model/product';
import { Category } from 'src/app/model/category'; // Ajout de l'importation du modèle Category
import { CATEGORIES } from 'src/app/model/mock-categories'; // Importation des catégories mockées
import { Order } from 'src/app/model/order';
import { PharmacyService } from 'src/app/services/pharmacy.service';
import { Observable } from 'rxjs/internal/Observable';
import { Pharmacy } from 'src/app/model/pharmacy';
import { map } from 'rxjs/internal/operators/map';

@Component({
  selector: 'app-pharmacy-management',
  templateUrl: './pharmacy-management.component.html',
  styleUrls: ['./pharmacy-management.component.css'],
})
export class PharmacyManagementComponent implements OnInit {
  products: Product[] = [];
  orders: Order[] = [];
  categories: Category[] = CATEGORIES; // Ajout des catégories
  newProduct: Product = {
    id: 0,
    name: '',
    description: '',
    price: 0,
    image: '',
    categoryId: 0,
    pharmacyId: 0, // ID de la pharmacie
    quantity: 0,
  };
  filteredProducts: Product[] = [];
  showAddModal = false;
  activeTab = 'medicaments';
  errorMessages: any = {}; // Objet pour stocker les messages d'erreur
  editMode = false;
  filtername: string = '';
  agent: AgentPharmacie | null = null;
  pharmacyName$: Observable<string> | null = null;

  constructor(
    private productsService: ProductsService,
    private pharmacyService: PharmacyService,
    private orderService: OrderService,
    private authService: AuthService
  ) {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && this.authService.isAgentPharmacie(currentUser)) {
      this.agent = currentUser;
      this.newProduct.pharmacyId = this.agent.idPharmacy;
      this.pharmacyName$ = this.getPharmacyName(this.agent.idPharmacy);
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
        this.errorMessages.general = 'Erreur lors du chargement des produits';
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
    this.newProduct = {
      id: 0,
      name: '',
      description: '',
      price: 0,
      image: '',
      categoryId: 0,
      pharmacyId: this.agent ? this.agent.idPharmacy : 0,
      quantity: 0,
    };
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
      this.errorMessages.general =
        "Erreur lors de l'ajout/mise à jour du produit";
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
      this.errorMessages.general = 'Erreur lors de la suppression du produit';
      console.error('Error deleting product:', error);
    }
  }

  validateProduct(product: Product): boolean {
    this.errorMessages = {};

    if (!product.name?.trim()) {
      this.errorMessages.name = 'Le nom du médicament est obligatoire.';
    }

    if (!product.description?.trim()) {
      this.errorMessages.description = 'La description est obligatoire.';
    }

    if (!product.price || product.price <= 0) {
      this.errorMessages.price = 'Le prix doit être supérieur à 0.';
    }

    if (!product.image?.trim()) {
      this.errorMessages.image = "L'URL de l'image est obligatoire.";
    }

    if (!product.categoryId) {
      this.errorMessages.categoryId = 'La catégorie est obligatoire.';
    }

    if (!product.pharmacyId) {
      this.errorMessages.pharmacyId = 'ID de la pharmacie est obligatoire.';
    }

    if (!product.quantity || product.quantity <= 0) {
      this.errorMessages.quantity = 'La quantité doit être supérieure à 0.';
    }

    return Object.keys(this.errorMessages).length === 0;
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
    this.errorMessages = {};
  }

  getPharmacyName(pharmacyId: number): Observable<string> {
    return this.pharmacyService
      .getPharmacyById(pharmacyId)
      .pipe(
        map((pharmacy: Pharmacy | undefined) =>
          pharmacy ? pharmacy.name : 'Pharmacie inconnue'
        )
      );
  }

  loadOrders(): void {
    if (this.agent) {
      try {
        this.orders = this.orderService.getOrdersByPharmacy(
          this.agent.idPharmacy
        );
        console.log('Orders chargés:', this.orders);
      } catch (error) {
        this.errorMessages.general = 'Erreur lors du chargement des commandes';
        console.error('Error loading orders:', error);
      }
    }
  }

  confirmPayment(orderId: number): void {
    try {
      this.orderService.confirmPayment(orderId);
      this.loadOrders(); // Recharger
    } catch (error) {
      this.errorMessages = 'Erreur lors de la confirmation du paiement';
      console.error('Error confirming payment:', error);
    }
  }

  confirmDelivery(orderId: number): void {
    try {
      this.orderService.confirmDelivery(orderId);
      this.loadOrders(); // Recharger la liste
    } catch (error) {
      this.errorMessages = 'Erreur lors de la confirmation de la livraison';
      console.error('Error confirming delivery:', error);
    }
  }
}
