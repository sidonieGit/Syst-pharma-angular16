import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Client } from '../model/client';

export enum UserRole {
  Admin = 'Admin',
  Agent = 'Agent',
  Client = 'Client',
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private currentUser: Client | null = null;

  constructor() {
    this.loadUserFromLocalStorage();
  }

  private saveUserToLocalStorage(client: Client): void {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    users.push(client);
    localStorage.setItem('users', JSON.stringify(users));
  }

  private loadUserFromLocalStorage(): void {
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (user) {
      this.currentUser = user;
      this.isLoggedInSubject.next(true);
    }
  }

  login(email: string, password: string): boolean {
    const users: Client[] = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      this.currentUser = user;
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.isLoggedInSubject.next(true);
      return true;
    }
    return false;
  }

  register(client: Client): boolean {
    const users: Client[] = JSON.parse(localStorage.getItem('users') || '[]');

    // Vérifiez si l'utilisateur existe déjà
    const userExists = users.some((u) => u.email === client.email);
    if (userExists) {
      return false; // Retourne faux si l'utilisateur existe déjà
    }

    this.saveUserToLocalStorage(client);
    return true; // Retourne vrai si l'inscription a réussi
  }

  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }
  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
    this.isLoggedInSubject.next(false);
  }

  getUserFullName(): string {
    return this.currentUser
      ? `${this.currentUser.firstName} ${this.currentUser.lastName}`
      : 'Guest';
  }

  getUserName(): string {
    return this.currentUser ? this.currentUser.email : 'Guest';
  }
  getUserFirstName(): string {
    return this.currentUser ? this.currentUser.firstName : 'Guest';
  }
  getUserRole(): UserRole | null {
    return this.currentUser ? (this.currentUser.role as UserRole) : null;
  }

  getCurrentUser(): Client | null {
    return this.currentUser;
  }
  // getUserRole(): UserRole | null {
  //   return this.currentUser ? this.currentUser.role : null;
  // }
}
