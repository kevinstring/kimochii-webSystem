import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface SalesItem {
  id: string;
  date: string;
  time: string;
  userId: string;
  userName: string;
  items: number;
  total: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  stats = [
    {
      title: 'Total Productos',
      value: 156,
      icon: 'pi pi-box',
      color: '#667eea'
    },
    {
      title: 'Stock Total',
      value: 3240,
      icon: 'pi pi-list',
      color: '#764ba2'
    },
    {
      title: 'Productos Bajos',
      value: 12,
      icon: 'pi pi-exclamation-circle',
      color: '#f093fb'
    },
    {
      title: 'Valor Inventario',
      value: 'Q45,230',
      icon: 'pi pi-dollar',
      color: '#4facfe'
    }
  ];

  salesByPeriod = [
    {
      period: 'Hoy',
      icon: 'pi pi-calendar-minus',
      total: 'Q2,450.00',
      transactions: 12,
      color: '#0073e6',
      key: 'today' as const
    },
    {
      period: 'Esta Semana',
      icon: 'pi pi-calendar',
      total: 'Q15,340.00',
      transactions: 67,
      color: '#667eea',
      key: 'week' as const
    },
    {
      period: 'Este Mes',
      icon: 'pi pi-calendar-plus',
      total: 'Q58,920.00',
      transactions: 289,
      color: '#764ba2',
      key: 'month' as const
    }
  ];

  // Datos simulados de ventas
  allSales: SalesItem[] = [
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
    },
    {
      id: 'VTA006',
      date: '2025-02-07',
      time: '10:15',
      userId: 'USR001',
      userName: 'Carlos',
      items: 4,
      total: 1920.00
    },
    {
      id: 'VTA007',
      date: '2025-02-05',
      time: '14:40',
      userId: 'USR003',
      userName: 'Juan',
      items: 7,
      total: 2890.50
    },
    {
      id: 'VTA008',
      date: '2025-02-04',
      time: '09:30',
      userId: 'USR002',
      userName: 'María',
      items: 5,
      total: 1923.00
    }
  ];

  modalOpen = false;
  selectedPeriod: 'today' | 'week' | 'month' = 'today';
  filteredSales: SalesItem[] = [];
  filteredTotal = 0;

  constructor() {}

  ngOnInit() {
  }

  openModal(periodKey: 'today' | 'week' | 'month') {
    this.selectedPeriod = periodKey;
    this.filterSalesByPeriod();
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
  }

  filterSalesByPeriod() {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    this.filteredSales = this.allSales.filter(sale => {
      const saleDate = new Date(sale.date);

      switch (this.selectedPeriod) {
        case 'today':
          return saleDate.toDateString() === today.toDateString();
        case 'week':
          return saleDate >= weekAgo;
        case 'month':
          return saleDate >= monthAgo;
        default:
          return true;
      }
    });

    this.filteredTotal = this.filteredSales.reduce((sum, sale) => sum + sale.total, 0);
  }

  getPeriodLabel(): string {
    const labels: Record<'today' | 'week' | 'month', string> = {
      today: 'Hoy',
      week: 'Esta Semana',
      month: 'Este Mes'
    };
    return labels[this.selectedPeriod];
  }
}
