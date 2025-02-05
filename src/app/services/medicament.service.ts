import { Injectable } from '@angular/core';

export interface Medicament {
  id: number;
  name: string;
  price: number;
}
@Injectable({
  providedIn: 'root',
})
export class MedicamentService {
  private medicaments: Medicament[] = [];

  getMedicaments(): Medicament[] {
    return this.medicaments;
  }

  addMedicament(medicament: Medicament) {
    this.medicaments.push(medicament);
  }

  deleteMedicament(id: number) {
    this.medicaments = this.medicaments.filter((m) => m.id !== id);
  }
}
