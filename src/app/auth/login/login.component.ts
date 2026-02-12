import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  userId: string = '';
  name: string = '';
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  handleLogin() {
    this.errorMessage = '';

    if (!this.userId.trim() || !this.name.trim()) {
      this.errorMessage = 'Por favor completa todos los campos';
      this.notificationService.warning(this.errorMessage, 'Validación');
      return;
    }

    this.authService.login(this.userId, this.name);
    this.notificationService.success(`¡Bienvenido, ${this.name}!`, 'Sesión iniciada');
    this.router.navigate(['/dashboard']);
  }

  handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.handleLogin();
    }
  }
}
