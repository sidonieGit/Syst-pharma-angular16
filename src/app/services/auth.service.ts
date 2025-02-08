import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Admin } from '../model/admin';
import { AgentPharmacie } from '../model/agent-pharmacie';
import { Client } from '../model/client';
import { User } from '../model/user';

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

  private currentUser: User | null = null;

  constructor() {
    this.loadUserFromLocalStorage();
    this.initializeAdmin(); // Initialiser un administrateur par défaut
  }

  private initializeAdmin(): void {
    const adminExists = JSON.parse(localStorage.getItem('users') || '[]').some(
      (user: User) => user.role === UserRole.Admin
    );

    if (!adminExists) {
      const defaultAdmin: Admin = {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@example.com',
        phone: '0000000000',
        password: 'admin123',
        role: UserRole.Admin,
      };
      this.saveUserToLocalStorage(defaultAdmin);
    }
  }

  setCurrentUser(user: User) {
    this.currentUser = user;
  }

  isClient(user: User): user is Client {
    return user.role === UserRole.Client;
  }

  isAdmin(user: User): user is Admin {
    return user.role === UserRole.Admin;
  }

  isAgentPharmacie(user: User): user is AgentPharmacie {
    return user.role === UserRole.Agent;
  }

  private saveUserToLocalStorage(user: User): void {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    users.push(user);
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
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
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
    client.role = UserRole.Client; // Rôle par défaut
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');

    const userExists = users.some((u) => u.email === client.email);
    if (userExists) {
      return false; // L'utilisateur existe déjà
    }

    this.saveUserToLocalStorage(client);
    return true;
  }

  addAgent(agent: AgentPharmacie): boolean {
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');

    const userExists = users.some((u) => u.email === agent.email);
    if (userExists) {
      return false; // L'agent existe déjà
    }

    this.saveUserToLocalStorage(agent);
    return true;
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

  getCurrentUser(): User | null {
    return this.currentUser;
  }
}
