import { Component, HostListener } from '@angular/core';

// Déclaration du composant principal de l'application
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'SystPharma';
  isVisible: boolean = false;

  // Détecte le défilement de la fenêtre et met à jour la visibilité du bouton
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    this.isVisible = scrollTop > 300; // Affiche le bouton après 300px de scroll
  }

  // Remonte en haut de la page avec un effet de défilement fluide
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
