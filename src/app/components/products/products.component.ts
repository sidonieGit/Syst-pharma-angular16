import { Component, HostListener, OnInit } from '@angular/core';
import { PRODUCTS } from 'src/app/model/mock-products';
import { Product } from 'src/app/model/product';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  products = PRODUCTS;
  cartItemCount: number = 0;
  categories: string[] = [
    'Anti-inflammatoires',
    'Antibiotiques',
    'Analgésiques',
    'Vitamines',
    'Suppléments',
  ];
  isVisible: boolean = false;

  constructor(
    private authService: AuthService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.cartService.cartTotalQuantity$.subscribe(
      (count) => (this.cartItemCount = count)
    );
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    this.isVisible = scrollTop > 100;
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  viewDetails(product: Product) {
    alert(
      `Détails du produit : ${product.name}\nDescription : ${product.description}\nPrix : ${product.price} €`
    );
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
}
