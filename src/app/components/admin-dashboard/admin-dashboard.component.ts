import { Component } from '@angular/core';
import { PharmacyService } from '../../services/pharmacy.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent {
  pharmacies = this.pharmacyService.getPharmacies();

  constructor(private pharmacyService: PharmacyService) {}

  // addPharmacy(name: string) {
  //   this.pharmacyService.addPharmacy({ id: Date.now(), name });
  // }

  deletePharmacy(id: number) {
    this.pharmacyService.deletePharmacy(id);
  }
}
