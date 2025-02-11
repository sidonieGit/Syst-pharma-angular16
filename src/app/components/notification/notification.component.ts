// notification.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { NotificationService } from '../../services/notification.service';
import { Notification } from '../../model/notification'; // Ajout de l'import de la classe Notification

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'], // Changé de .scss à .css
  animations: [
    trigger('fadeInOut', [
      state(
        'void',
        style({
          opacity: 0,
          transform: 'translateY(-20px)',
        })
      ),
      transition('void <=> *', animate('300ms ease-in-out')),
    ]),
  ],
})
export class NotificationComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  private subscription: Subscription;
  private timeouts: Map<string, any> = new Map();

  constructor(private notificationService: NotificationService) {
    this.subscription = this.notificationService.notification.subscribe(
      (notification) => {
        if (notification) {
          this.showNotification(notification);
        }
      }
    );
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.timeouts.forEach((timeout) => clearTimeout(timeout));
  }

  public removeNotification(id: string): void {
    const index = this.notifications.findIndex((n) => n.id === id);
    if (index !== -1) {
      this.notifications.splice(index, 1);
      const timeout = this.timeouts.get(id);
      if (timeout) {
        clearTimeout(timeout);
        this.timeouts.delete(id);
      }
    }
  }

  private showNotification(notification: Notification): void {
    this.notifications.push(notification);

    const timeout = setTimeout(() => {
      this.removeNotification(notification.id);
    }, 3000);

    this.timeouts.set(notification.id, timeout);
  }
}
