import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('kimochii-webSystem');

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const usuarioComprobado = localStorage.getItem('usuarioComprobado');
      const nombreUsuario = localStorage.getItem('nombreUsuario');
      const idPuesto = localStorage.getItem('idPuesto');

    }
  }
}
