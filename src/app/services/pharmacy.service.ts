import { Injectable } from '@angular/core';
import { Pharmacy } from '../model/pharmacy';
import { Observable, of } from 'rxjs';
import { Order } from '../model/order';

@Injectable({
  providedIn: 'root',
})
export class PharmacyService {
  private readonly STORAGE_KEY = 'pharmacies';
  private initialPharmacies: Pharmacy[] = [
    {
      id: 1,
      name: 'Pharmacie Centrale',
      address: '123 Rue Principale',
      phone: '0123456789',
    },
    {
      id: 2,
      name: 'Pharmacie du Nord',
      address: '456 Rue Principale',
      phone: '0987654321',
    },
  ];

  constructor() {
    this.initializePharmacies();
  }

  private initializePharmacies(): void {
    const storedPharmacies = localStorage.getItem(this.STORAGE_KEY);
    if (!storedPharmacies) {
      this.savePharmacies(this.initialPharmacies);
    } else {
      console.log('Pharmacies au démarrage:', JSON.parse(storedPharmacies));
    }
  }

  getPharmacies(): Pharmacy[] {
    const storedPharmacies = localStorage.getItem(this.STORAGE_KEY);
    if (!storedPharmacies) {
      return [];
    }
    return JSON.parse(storedPharmacies);
  }

  addPharmacy(pharmacy: Pharmacy): void {
    console.log('Adding pharmacy:', pharmacy);
    const pharmacies = this.getPharmacies();
    const lastId = Math.max(...pharmacies.map((p) => p.id), 0);
    pharmacy.id = lastId + 1;

    pharmacies.push(pharmacy);
    this.savePharmacies(pharmacies);
    console.log('Pharmacies after addition:', pharmacies);
  }

  updatePharmacy(updatedPharmacy: Pharmacy): void {
    const pharmacies = this.getPharmacies();
    const index = pharmacies.findIndex((p) => p.id === updatedPharmacy.id);

    if (index !== -1) {
      pharmacies[index] = updatedPharmacy;
      this.savePharmacies(pharmacies);
    }
  }

  deletePharmacy(id: number): void {
    const pharmacies = this.getPharmacies();
    const updatedPharmacies = pharmacies.filter((p) => p.id !== id);
    this.savePharmacies(updatedPharmacies);
  }

  private savePharmacies(pharmacies: Pharmacy[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(pharmacies));
      console.log('Pharmacies sauvegardées:', pharmacies);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des pharmacies:', error);
      throw new Error('Erreur lors de la sauvegarde des pharmacies');
    }
  }

  getPharmacyById(id: number): Observable<Pharmacy | undefined> {
    const pharmacies = this.getPharmacies();
    const pharmacy = pharmacies.find((p) => p.id === id);
    return of(pharmacy);
  }

  getTotalUsers(): number {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.length;
  }

  getTotalPharmacies(): number {
    return this.getPharmacies().length;
  }

  // getPendingOrders(): number {
  //   const orders: Order[] = JSON.parse(localStorage.getItem('orders') || '[]');
  //   return orders.filter((order: Order) => order.status === 'pending').length;
  // }
  getPendingOrders(): number {
    const orders: Order[] = JSON.parse(localStorage.getItem('orders') || '[]');
    return orders.filter((order: Order) => order.status === 'Pending').length;
  }

  // Méthode utile pour le développement
  resetToInitialData(): void {
    localStorage.setItem(
      this.STORAGE_KEY,
      JSON.stringify(this.initialPharmacies)
    );
  }

  // Méthode utile pour le développement
  clearPharmacies(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.initializePharmacies();
  }
}
