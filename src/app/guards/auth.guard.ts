import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    // Verificar autenticación (la sesión ya fue restaurada en App)
    const isAuth = this.authService.isAuthenticated();
    
    // Fallback: verificar localStorage directamente
    if (!isAuth && typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const usuarioComprobado = localStorage.getItem('usuarioComprobado');
      if (usuarioComprobado === '1') {
        return true;
      }
    }
    
    if (!isAuth) {
      this.router.navigate(['/login']);
      return false;
    }
    
    return true;
  }
}
