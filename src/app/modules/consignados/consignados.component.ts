import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../services/notification.service';

interface ConsignedCategory {
  id: string;
  name: string;
  icon: string;
  total: number;
  pending: number;
  earned: number;
  productCount: number;
  color: string;
}

interface ConsignmentOption {
  id: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-consignados',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './consignados.component.html',
  styleUrl: './consignados.component.css'
})
export class ConsignadosComponent implements OnInit {
  categories: ConsignedCategory[] = [];
  selectedConsignment: string = 'all';
  isLoading: boolean = false;

  consignmentOptions: ConsignmentOption[] = [
    { id: 'all', label: 'Todos los productos', icon: 'pi-list' },
    { id: 'active', label: 'En consignación', icon: 'pi-check' },
    { id: 'completed', label: 'Completados', icon: 'pi-check-circle' },
    { id: 'pending', label: 'Por cobrar', icon: 'pi-dollar' }
  ];

  mockCategories: ConsignedCategory[] = [
    {
      id: 'camisetas',
      name: 'Camisetas Sublimadas',
      icon: 'pi-shopping-bag',
      total: 2770,
      pending: 1896.2,
      earned: 873.8,
      productCount: 24,
      color: '#667eea'
    },
    {
      id: 'tazas',
      name: 'Tazas Personalizadas',
      icon: 'pi-circle-fill',
      total: 850,
      pending: 628,
      earned: 222,
      productCount: 15,
      color: '#764ba2'
    },
    {
      id: 'otros',
      name: 'Otros Productos',
      icon: 'pi-box',
      total: 0,
      pending: 0,
      earned: 0,
      productCount: 0,
      color: '#22c55e'
    }
  ];

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.loadConsignedData();
  }

  loadConsignedData() {
    this.categories = [...this.mockCategories];
  }

  getTotalGeneral(): number {
    return this.categories.reduce((sum, cat) => sum + cat.total, 0);
  }

  getTotalPendingGeneral(): number {
    return this.categories.reduce((sum, cat) => sum + cat.pending, 0);
  }

  getTotalEarnedGeneral(): number {
    return this.categories.reduce((sum, cat) => sum + cat.earned, 0);
  }

  closeCategory(category: ConsignedCategory) {
    const index = this.categories.indexOf(category);
    if (index > -1) {
      this.categories.splice(index, 1);
      this.notificationService.info(`Consignación "${category.name}" cerrada`, 'Cerrado');
    }
  }

  selectConsignment(optionId: string) {
    this.selectedConsignment = optionId;
    const option = this.consignmentOptions.find(o => o.id === optionId);
    this.notificationService.info(`Mostrando: ${option?.label}`, 'Filtro');
  }

  exportToExcel() {
    this.isLoading = true;
    
    // Simular descarga de Excel
    setTimeout(() => {
      this.isLoading = false;
      this.notificationService.success('Archivo Excel descargado exitosamente', 'Exportación');
    }, 1500);
  }

  getTotalProductCount(): number {
    return this.categories.reduce((sum, cat) => sum + cat.productCount, 0);
  }
}
