import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  id: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly STORAGE_KEY = 'kimochii_user';
  private currentUserSubject = new BehaviorSubject<User | null>(
    this.isBrowser() ? this.getUserFromStorage() : null
  );
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {}

  /**
   * Verifica si estamos en un navegador (no SSR)
   */
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  /**
   * Simula login del usuario
   * En el futuro se reemplazará con llamada a API del backend
   */
  login(id: string, name: string): void {
    const user: User = { id, name };
    if (this.isBrowser()) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    }
    this.currentUserSubject.next(user);
  }

  /**
   * Obtiene el usuario actual
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Verifica si el usuario está logueado
   */
  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  /**
   * Cierra sesión del usuario
   */
  logout(): void {
    if (this.isBrowser()) {
      localStorage.removeItem(this.STORAGE_KEY);
    }
    this.currentUserSubject.next(null);
  }

  /**
   * Obtiene el usuario del localStorage
   */
  private getUserFromStorage(): User | null {
    if (!this.isBrowser()) {
      return null;
    }
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  }
}

