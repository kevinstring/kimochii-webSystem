import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

export interface User {
  id: number;
  nickname: string;
  idPuesto: number;
}

export interface LoginResponse {
  response: {
    ID_APP_USUARIO: number;
    NICKNAME: string;
    PASSWORD: string;
    ID_PUESTO: number;
  }
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'https://kimochiistore.com/kystem/back/public';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Restaurar sesión del localStorage cuando estemos en el navegador
    this.restoreSession();
  }

  /**
   * Restaura la sesión del usuario desde localStorage
   */
  private restoreSession(): void {
  
      const user = this.getUserFromStorage();
      if (user) {
        this.currentUserSubject.next(user);
      
    }
  }

  /**
   * Verifica si estamos en un navegador (no SSR)
   */
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  /**
   * Realiza login del usuario con el backend real
   */
  login(nickname: string, password: string): Observable<User> {
    const formData = new FormData();
    formData.append('nickname', nickname);
    formData.append('password', password);

    return this.http.post<LoginResponse>(`${this.API_URL}/revisarUsuario`, formData).pipe(
      map(response => {
        const data = response.response;
        const user: User = {
          id: data.ID_APP_USUARIO || 0,
          nickname: data.NICKNAME || nickname,
          idPuesto: data.ID_PUESTO || 0
        };
        return user;
      }),
      tap(user => {
        if (this.isBrowser()) {
          const nicknameValue = user.nickname || '';
          
          localStorage.setItem('usuarioComprobado', '1');
          localStorage.setItem('nombreUsuario', nicknameValue);
          localStorage.setItem('idUsuario', user.id.toString());
          localStorage.setItem('idPuesto', user.idPuesto.toString());
          localStorage.setItem('modo', 'Local');
        }
        this.currentUserSubject.next(user);
      })
    );
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
      localStorage.removeItem('usuarioComprobado');
      localStorage.removeItem('nombreUsuario');
      localStorage.removeItem('idUsuario');
      localStorage.removeItem('idPuesto');
      localStorage.removeItem('modo');
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
    
    const usuarioComprobado = localStorage.getItem('usuarioComprobado');
    const nombreUsuario = localStorage.getItem('nombreUsuario');
    const idUsuario = localStorage.getItem('idUsuario');
    const idPuesto = localStorage.getItem('idPuesto');
    
    if (usuarioComprobado === '1' && nombreUsuario && idPuesto) {
      return {
        id: idUsuario ? parseInt(idUsuario, 10) : 0,
        nickname: nombreUsuario,
        idPuesto: parseInt(idPuesto, 10)
      };
    }
    
    return null;
  }
}

