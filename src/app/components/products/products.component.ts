import { Component, HostListener, OnInit } from '@angular/core';
import { CATEGORIES } from '../../model/mock-categories';
import { Product } from '../../model/product';
import { Pharmacy } from '../../model/pharmacy';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { ProductsService } from '../../services/medicament.service';
import { PharmacyService } from '../../services/pharmacy.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  filtername: string = '';
  filteredProducts: Product[] = [];
  cartItemCount: number = 0;
  categories = CATEGORIES;
  pharmacies: Pharmacy[] = [];
  selectedCategory: number | null = null;
  selectedPharmacy: number | null = null;
  isVisible: boolean = false;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private productsService: ProductsService,
    private pharmacyService: PharmacyService
  ) {}

  ngOnInit(): void {
    this.productsService.loadProducts();
    this.products = this.productsService.getProducts();
    this.filteredProducts = this.products;

    this.cartService.cartTotalQuantity$.subscribe(
      (count) => (this.cartItemCount = count)
    );

    this.pharmacies = this.pharmacyService.getPharmacies();

    this.productsService.searchTerm$.subscribe((term) => {
      this.filtername = term;
      this.updateFilteredProducts();
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isVisible = window.scrollY > 100;
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  viewDetails(product: Product) {
    alert(
      `Détails du produit : ${product.name}\nDescription : ${product.description}\nPrix : ${product.price} €`
    );
  }

  updateFilteredProducts() {
    this.filteredProducts = this.products.filter((product) => {
      const nameMatch = product.name
        .toLowerCase()
        .includes(this.filtername.toLowerCase());
      const categoryMatch =
        this.selectedCategory === null ||
        product.categoryId === this.selectedCategory;
      const pharmacyMatch =
        this.selectedPharmacy === null ||
        product.pharmacyId === this.selectedPharmacy;

      return nameMatch && categoryMatch && pharmacyMatch;
    });
  }

  addToCart(product: Product) {
    const result = this.cartService.addItemToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      pharmacyId: product.pharmacyId,
    });
    alert(result);
  }

  selectCategory(categoryId: number | null) {
    this.selectedCategory = categoryId;
    this.updateFilteredProducts();
  }

  selectPharmacy(pharmacyId: number | null) {
    this.selectedPharmacy = pharmacyId;
    this.updateFilteredProducts();
  }
}
