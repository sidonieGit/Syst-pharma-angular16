import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { PharmacyService } from '../../services/pharmacy.service';
import { Pharmacy } from '../../model/pharmacy';
import { Chart, ChartConfiguration } from 'chart.js/auto';
import { AuthService, UserRole } from '../../services/auth.service';
import { AgentPharmacie } from '../../model/agent-pharmacie';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  @ViewChild('dashboardChart') chartCanvas?: ElementRef<HTMLCanvasElement>;

  // Propriétés pour les statistiques
  totalUsers: number = 0;
  totalPharmacies: number = 0;
  pendingOrders: number = 0;

  // Autres propriétés
  chart?: Chart;
  pharmacies: Pharmacy[] = [];
  newPharmacy: Pharmacy = { id: 0, name: '', address: '', phone: '' };
  newAgent: AgentPharmacie = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    matriculePharmacie: '',
    idPharmacy: 0,
    role: UserRole.Agent,
  };
  editMode = false;
  activeTab = 'dashboard';
  errorMessage = '';

  constructor(
    private pharmacyService: PharmacyService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    console.log(
      'Pharmacies au démarrage:',
      this.pharmacyService.getPharmacies()
    );

    this.loadStatistics();
    this.loadPharmacies();
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  loadStatistics(): void {
    this.totalUsers = this.pharmacyService.getTotalUsers();
    this.totalPharmacies = this.pharmacyService.getTotalPharmacies();
    this.pendingOrders = this.pharmacyService.getPendingOrders();

    // Attendre le prochain cycle de détection des changements
    setTimeout(() => this.renderChart(), 0);
  }

  renderChart(): void {
    if (!this.chartCanvas) {
      console.error('Canvas element not found');
      return;
    }

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('Could not get 2D context');
      return;
    }

    if (this.chart) {
      this.chart.destroy();
    }

    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: ['Utilisateurs', 'Pharmacies', 'Commandes en attente'],
        datasets: [
          {
            label: 'Statistiques',
            data: [this.totalUsers, this.totalPharmacies, this.pendingOrders],
            backgroundColor: ['#007bff', '#28a745', '#ffc107'],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
            },
          },
        },
      },
    };

    this.chart = new Chart(ctx, config);
  }

  loadPharmacies(): void {
    try {
      this.pharmacies = this.pharmacyService.getPharmacies();
      console.log('Pharmacies chargées:', this.pharmacies);
    } catch (error) {
      this.errorMessage = 'Erreur lors du chargement des pharmacies';
      console.error('Error loading pharmacies:', error);
    }
  }

  addPharmacy(): void {
    if (!this.validatePharmacy(this.newPharmacy)) {
      return;
    }

    try {
      this.pharmacyService.addPharmacy(this.newPharmacy);
      this.newAgent.idPharmacy = this.newPharmacy.id;
      this.authService.addAgent(this.newAgent);
      this.loadPharmacies(); // Recharger la liste
      this.resetForm();
    } catch (error) {
      this.errorMessage =
        "Erreur lors de l'ajout de la pharmacie et de l'agent";
      console.error('Error adding pharmacy and agent:', error);
    }
  }

  deletePharmacy(id: number): void {
    try {
      this.pharmacyService.deletePharmacy(id);
      this.loadPharmacies(); // Recharger la liste
    } catch (error) {
      this.errorMessage = 'Erreur lors de la suppression de la pharmacie';
      console.error('Error deleting pharmacy:', error);
    }
  }

  updatePharmacy(): void {
    if (!this.validatePharmacy(this.newPharmacy)) {
      return;
    }

    try {
      this.pharmacyService.updatePharmacy(this.newPharmacy);
      this.loadPharmacies(); // Recharger la liste
      this.resetForm();
    } catch (error) {
      this.errorMessage = 'Erreur lors de la mise à jour de la pharmacie';
      console.error('Error updating pharmacy:', error);
    }
  }

  validatePharmacy(pharmacy: Pharmacy): boolean {
    if (
      !pharmacy.name?.trim() ||
      !pharmacy.address?.trim() ||
      !pharmacy.phone?.trim()
    ) {
      this.errorMessage = 'Veuillez remplir tous les champs correctement.';
      return false;
    }
    return true;
  }

  editPharmacy(pharmacy: Pharmacy): void {
    this.newPharmacy = { ...pharmacy };
    this.editMode = true;
    this.errorMessage = '';
  }

  resetForm(): void {
    this.newPharmacy = { id: 0, name: '', address: '', phone: '' };
    this.newAgent = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      matriculePharmacie: '',
      idPharmacy: 0,
      role: UserRole.Agent,
    };
    this.editMode = false;
    this.errorMessage = '';
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}
