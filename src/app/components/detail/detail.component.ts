import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/model/product';
import { Pharmacy } from 'src/app/model/pharmacy';
import { CartService } from 'src/app/services/cart.service';
import { PharmacyService } from 'src/app/services/pharmacy.service';
import { PRODUCTS } from 'src/app/model/mock-products'; // Assurez-vous que le chemin est correct

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
})
export class DetailsComponent implements OnInit {
  product!: Product | undefined;
  pharmacy!: Pharmacy | undefined;

  constructor(
    private route: ActivatedRoute,
    private pharmacyService: PharmacyService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadProductDetails();
  }

  /**
   * Charge les détails du produit basé sur l'ID de l'URL
   */
  private loadProductDetails(): void {
    const productId = Number(this.route.snapshot.paramMap.get('id'));
    if (!isNaN(productId)) {
      this.product = PRODUCTS.find((product) => product.id === productId);

      if (this.product && this.product.pharmacyId) {
        this.loadPharmacyDetails(this.product.pharmacyId);
      }
    } else {
      console.error('ID du produit invalide'); //  permet
    }
  }

  /**
   * Charge les détails de la pharmacie associée au produit
   */
  private loadPharmacyDetails(pharmacyId: number): void {
    this.pharmacyService.getPharmacyById(pharmacyId).subscribe({
      next: (pharmacy) => {
        if (pharmacy) {
          this.pharmacy = pharmacy;
        } else {
          console.warn('Aucune pharmacie trouvée avec cet ID.');
        }
      },
      error: (err) =>
        console.error('Erreur lors de la récupération de la pharmacie:', err),
    });
  }

  /**
   * Ajoute le produit actuel au panier
   */
  addToCart(): void {
    if (this.product) {
      const result = this.cartService.addItemToCart({
        id: this.product.id,
        name: this.product.name,
        price: this.product.price,
        quantity: 1,
        pharmacyId: this.product.pharmacyId,
      });
      alert(result);
    } else {
      console.warn('Aucun produit sélectionné pour l’ajout au panier');
    }
  }
}
