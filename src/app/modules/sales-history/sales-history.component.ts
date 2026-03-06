import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SalesService } from '../../services/sales.service';
import { AuthService } from '../../services/auth.service';

interface SalesHistoryItem {
  ID_INGRESO: number;
  MOTIVO: string;
  // Agregamos más campos según lo que recibas del backend
}

@Component({
  selector: 'app-sales-history',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './sales-history.component.html',
  styleUrl: './sales-history.component.css'
})
export class SalesHistoryComponent implements OnInit {
  sales: SalesHistoryItem[] = [];
  filterPeriod: number = 1; // 1 = Hoy, 2 = Semana, 3 = Mes, 4 = Todo
  totalBanco: number = 0;
  totalCaja: number = 0;
  isLoading: boolean = false;

  filterOptions: Array<{ value: number; label: string }> = [
    { value: 1, label: 'Hoy' },
    { value: 2, label: 'Esta Semana' },
    { value: 3, label: 'Este Mes' },
    { value: 4, label: 'Todo' }
  ];

  constructor(
    private salesService: SalesService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadSales(1); // Cargar por defecto el período "Hoy"
  }

  loadSales(filterPeriod:number) {
    this.filterPeriod=filterPeriod;


    this.isLoading = true;
    
    this.salesService.getHistorialVentas(this.filterPeriod,1).subscribe({
      next: (response) => {
        if (response.success==true) {
          console.log('Respuesta del backend:', response);
          this.sales = response.registros;
          this.totalBanco = response.totalBanco;
          this.totalCaja = response.totalCaja;
                  this.isLoading = false;
        } else {
          console.error('Error al cargar historial:');
          this.isLoading = false;
              
        }
      },
      error: (error) => {
        console.error('Error al cargar historial:', error);
        this.isLoading = false;
      },
      complete: () => { 
        this.isLoading = false;
               console.log('Carga de historial de ventas completada');
      } 
    });
  }

  onFilterChange(filterPeriod: number) {
    console.log('Período seleccionado:', filterPeriod);
    this.loadSales(filterPeriod);
  }

  getTotalSales(): number {
    return this.totalCaja + this.totalBanco;
  }

  getTotalTransactions(): number {
    return this.sales.length;
  }

  getTotalItems(): number {
    // Esto depende de cómo viene la información de items en cada registro
    // Por ahora retornamos 0, se puede ajustar según la estructura real
    return 0;
  }
}
