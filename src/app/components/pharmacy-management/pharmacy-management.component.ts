import { Component } from '@angular/core';
import { MedicamentService } from '../../services/medicament.service';

@Component({
  selector: 'app-pharmacy-management',
  templateUrl: './pharmacy-management.component.html',
  styleUrls: ['./pharmacy-management.component.css'],
})
export class PharmacyManagementComponent {
  medicaments = this.medicamentService.getMedicaments();

  constructor(private medicamentService: MedicamentService) {}

  addMedicament(name: string, price: number) {
    this.medicamentService.addMedicament({ id: Date.now(), name, price });
  }

  deleteMedicament(id: number) {
    this.medicamentService.deleteMedicament(id);
  }
}
