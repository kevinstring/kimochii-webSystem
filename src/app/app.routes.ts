import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'sales',
        loadComponent: () => import('./modules/sales/sales.component').then(m => m.SalesComponent)
      },
      {
        path: 'sales-history',
        loadComponent: () => import('./modules/sales-history/sales-history.component').then(m => m.SalesHistoryComponent)
      },
      {
        path: 'expenses',
        loadComponent: () => import('./modules/expenses/expenses.component').then(m => m.ExpensesComponent)
      },
      {
        path: 'pending',
        loadComponent: () => import('./modules/pending/pending.component').then(m => m.PendingComponent)
      },
      {
        path: 'consignados',
        loadComponent: () => import('./modules/consignados/consignados.component').then(m => m.ConsignadosComponent)
      },
      {
        path: 'products',
        loadComponent: () => import('./modules/products/products.component').then(m => m.ProductsComponent)
      },
      {
        path: 'inventory',
        loadComponent: () => import('./modules/inventory/inventory.component').then(m => m.InventoryComponent)
      },
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
