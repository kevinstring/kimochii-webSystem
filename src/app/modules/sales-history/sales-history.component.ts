import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface SalesHistoryItem {
  id: string;
  date: string;
  time: string;
  userId: string;
  userName: string;
  items: number;
  total: number;
}

@Component({
  selector: 'app-sales-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sales-history.component.html',
  styleUrl: './sales-history.component.css'
})
export class SalesHistoryComponent implements OnInit {
  sales: SalesHistoryItem[] = [];
  filterPeriod: 'today' | 'week' | 'month' | 'all' = 'all';

  filterOptions: Array<{ value: 'today' | 'week' | 'month' | 'all'; label: string }> = [
    { value: 'today', label: 'Hoy' },
    { value: 'week', label: 'Esta Semana' },
    { value: 'month', label: 'Este Mes' },
    { value: 'all', label: 'Todo' }
  ];

  constructor() {}

  ngOnInit() {
    this.loadSales();
  }

  loadSales() {
    // Datos simulados - se reemplazará con llamada a API del backend
    this.sales = [
      {
        id: 'VTA001',
        date: '2025-02-11',
        time: '14:30',
        userId: 'USR001',
        userName: 'Carlos',
        items: 5,
        total: 2450.00
      },
      {
        id: 'VTA002',
        date: '2025-02-11',
        time: '13:15',
        userId: 'USR002',
        userName: 'María',
        items: 3,
        total: 890.50
      },
      {
        id: 'VTA003',
        date: '2025-02-10',
        time: '16:45',
        userId: 'USR001',
        userName: 'Carlos',
        items: 8,
        total: 3210.75
      },
      {
        id: 'VTA004',
        date: '2025-02-09',
        time: '11:00',
        userId: 'USR003',
        userName: 'Juan',
        items: 2,
        total: 450.00
      },
      {
        id: 'VTA005',
        date: '2025-02-08',
        time: '15:20',
        userId: 'USR002',
        userName: 'María',
        items: 6,
        total: 1875.25
      }
    ];
  }

  getFilteredSales(): SalesHistoryItem[] {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    return this.sales.filter(sale => {
      const saleDate = new Date(sale.date);

      switch (this.filterPeriod) {
        case 'today':
          return saleDate.toDateString() === today.toDateString();
        case 'week':
          return saleDate >= weekAgo;
        case 'month':
          return saleDate >= monthAgo;
        case 'all':
        default:
          return true;
      }
    });
  }

  getTotalSales(): number {
    return this.getFilteredSales().reduce((sum, sale) => sum + sale.total, 0);
  }

  getTotalTransactions(): number {
    return this.getFilteredSales().length;
  }

  getTotalItems(): number {
    return this.getFilteredSales().reduce((sum, sale) => sum + sale.items, 0);
  }
}
