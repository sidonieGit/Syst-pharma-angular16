import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Notification } from '../model/notification';
// Définition de l'interface Notification

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  // Crée un BehaviorSubject pour émettre des notifications
  private notificationSubject = new BehaviorSubject<Notification | null>(null);
  // Observable à utiliser dans le composant
  notification = this.notificationSubject.asObservable();

  /**
   * Méthode pour afficher une notification.
   * @param message Le message de la notification.
   * @param type Le type de notification ('success', 'error', 'warning', 'info').
   */
  show(
    message: string,
    type: 'success' | 'error' | 'warning' | 'info',
    duration: number = 3000
  ): void {
    const notification: Notification = {
      message,
      type,
      id: Date.now().toString(), // Add unique ID for multiple notifications
    };
    this.notificationSubject.next(notification);
  }

  clear(): void {
    this.notificationSubject.next(null);
  }
}
