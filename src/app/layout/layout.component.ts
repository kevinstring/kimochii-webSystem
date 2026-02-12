import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService, User } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';
import { Observable } from 'rxjs';

interface MenuItem {
  label: string;
  icon: string;
  routerLink: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit {
  sidebarVisible = true;
  currentUser$: Observable<User | null>;
  
  menuItems: MenuItem[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit() {
    this.initializeMenu();
  }

  initializeMenu() {
    this.menuItems = [
      {
        label: 'Dashboard',
        icon: 'pi pi-fw pi-home',
        routerLink: '/dashboard'
      },
      {
        label: 'Registrar Venta',
        icon: 'pi pi-fw pi-shopping-cart',
        routerLink: '/sales'
      },
      {
        label: 'Historial de Ventas',
        icon: 'pi pi-fw pi-list',
        routerLink: '/sales-history'
      },
      {
        label: 'Registrar Gasto',
        icon: 'pi pi-fw pi-dollar',
        routerLink: '/expenses'
      },
      {
        label: 'Pendientes',
        icon: 'pi pi-fw pi-clipboard',
        routerLink: '/pending'
      },
      {
        label: 'Consignados',
        icon: 'pi pi-fw pi-inbox',
        routerLink: '/consignados'
      },
      {
        label: 'Productos',
        icon: 'pi pi-fw pi-box',
        routerLink: '/products'
      },
      {
        label: 'Inventario',
        icon: 'pi pi-fw pi-database',
        routerLink: '/inventory'
      }
    ];
  }

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  logout() {
    const user = this.authService.getCurrentUser();
    this.authService.logout();
    this.notificationService.info(`¡Hasta luego, ${user?.name}!`, 'Sesión cerrada');
    this.router.navigate(['/login']);
  }
}
