import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NavService {
  // État initial fermé (false)
  private isExpandedSource = new BehaviorSubject<boolean>(false);
  isExpanded$ = this.isExpandedSource.asObservable();

  // Bascule l'état d'expansion
  toggleNavbar(): void {
    this.isExpandedSource.next(!this.isExpandedSource.value);
  }

  // Force la fermeture de la navbar
  collapseNavbar(): void {
    this.isExpandedSource.next(false);
  }
}
