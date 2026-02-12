import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../services/notification.service';
import { PendingModalComponent } from './pending-modal.component';

interface PendingItem {
  id: string;
  client: string;
  clientInitial: string;
  title: string;
  details: string;
  amount: number;
  cost: number;
  status: 'pending' | 'in_process' | 'completed';
  paymentMethod: 'cash' | 'card';
  quantity: number;
  date: string;
}

type FilterStatus = 'all' | 'pending' | 'in_process' | 'completed';

@Component({
  selector: 'app-pending',
  standalone: true,
  imports: [CommonModule, FormsModule, PendingModalComponent],
  templateUrl: './pending.component.html',
  styleUrl: './pending.component.css'
})
export class PendingComponent implements OnInit {
  pendingItems: PendingItem[] = [];
  filteredItems: PendingItem[] = [];
  currentFilter: FilterStatus = 'pending';
  isLoading: boolean = false;
  isModalOpen: boolean = false;

  // Datos de ejemplo
  mockData: PendingItem[] = [
    {
      id: '1',
      client: 'Laurencin',
      clientInitial: 'L',
      title: '1 Poster con fotos de gato',
      details: 'Detalles por whatsapp. Entrega a FORZA LUNES',
      amount: 45.00,
      cost: 0,
      status: 'pending',
      paymentMethod: 'cash',
      quantity: 1,
      date: '2026-02-12'
    },
    {
      id: '2',
      client: 'María García',
      clientInitial: 'M',
      title: '5 Tazas personalizadas',
      details: 'Diseño personalizado con nombre. Entrega viernes',
      amount: 125.00,
      cost: 45.00,
      status: 'in_process',
      paymentMethod: 'card',
      quantity: 5,
      date: '2026-02-11'
    },
    {
      id: '3',
      client: 'Carlos López',
      clientInitial: 'C',
      title: '3 Camisetas sublimadas',
      details: 'Color blanco, talla M, L, XL',
      amount: 180.00,
      cost: 65.00,
      status: 'completed',
      paymentMethod: 'card',
      quantity: 3,
      date: '2026-02-10'
    },
    {
      id: '4',
      client: 'Ana Rodríguez',
      clientInitial: 'A',
      title: 'Almohada con foto',
      details: 'Foto familiar, entrega este fin de semana',
      amount: 85.00,
      cost: 30.00,
      status: 'pending',
      paymentMethod: 'cash',
      quantity: 1,
      date: '2026-02-12'
    },
    {
      id: '5',
      client: 'Pedro Morales',
      clientInitial: 'P',
      title: '10 Llaveros grabados',
      details: 'Grabado personalizado con nombre/empresa',
      amount: 150.00,
      cost: 50.00,
      status: 'in_process',
      paymentMethod: 'cash',
      quantity: 10,
      date: '2026-02-09'
    }
  ];

  filterTabs: Array<{ key: FilterStatus; label: string; icon: string; count: number }> = [
    { key: 'all', label: 'Todos', icon: 'pi-list', count: 0 },
    { key: 'pending', label: 'Pendientes', icon: 'pi-hourglass', count: 0 },
    { key: 'in_process', label: 'En Proceso', icon: 'pi-spinner', count: 0 },
    { key: 'completed', label: 'Realizados', icon: 'pi-check', count: 0 }
  ];

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.loadPendingItems();
  }

  loadPendingItems() {
    this.pendingItems = [...this.mockData];
    this.updateFilterCounts();
    this.applyFilter(this.currentFilter);
  }

  updateFilterCounts() {
    this.filterTabs.forEach(tab => {
      if (tab.key === 'all') {
        tab.count = this.pendingItems.length;
      } else {
        const statusMap = {
          'pending': 'pending',
          'in_process': 'in_process',
          'completed': 'completed'
        };
        tab.count = this.pendingItems.filter(item => item.status === statusMap[tab.key as keyof typeof statusMap]).length;
      }
    });
  }

  applyFilter(filter: string | FilterStatus) {
    this.currentFilter = filter as FilterStatus;
    
    if (filter === 'all') {
      this.filteredItems = [...this.pendingItems];
    } else {
      const statusMap: { [key: string]: string } = {
        'pending': 'pending',
        'in_process': 'in_process',
        'completed': 'completed'
      };
      this.filteredItems = this.pendingItems.filter(
        item => item.status === statusMap[filter as string]
      );
    }
  }

  getStatusLabel(status: string): string {
    const statusMap: { [key: string]: string } = {
      'pending': 'Pendiente',
      'in_process': 'En Proceso',
      'completed': 'Realizado'
    };
    return statusMap[status] || status;
  }

  getPaymentMethodLabel(method: string): string {
    return method === 'cash' ? 'Efectivo' : 'Tarjeta';
  }

  updateStatus(item: PendingItem, newStatus: 'pending' | 'in_process' | 'completed') {
    item.status = newStatus;
    this.updateFilterCounts();
    this.applyFilter(this.currentFilter);
    this.notificationService.success(`Estado actualizado a: ${this.getStatusLabel(newStatus)}`, 'Actualizado');
  }

  updateQuantity(item: PendingItem, newQuantity: number) {
    if (newQuantity > 0) {
      item.quantity = newQuantity;
      this.notificationService.info(`Cantidad actualizada a ${newQuantity}`, 'Actualizado');
    }
  }

  deletePending(item: PendingItem) {
    const index = this.pendingItems.indexOf(item);
    if (index > -1) {
      this.pendingItems.splice(index, 1);
      this.updateFilterCounts();
      this.applyFilter(this.currentFilter);
      this.notificationService.success('Pendiente eliminado', 'Eliminado');
    }
  }

  addNewPending() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  onSaveNewPending(data: any) {
    // Crear un nuevo pendiente desde los datos del modal
    const newPending: PendingItem = {
      id: Date.now().toString(),
      client: data.clientName,
      clientInitial: data.clientName.charAt(0).toUpperCase(),
      title: data.title,
      details: `${data.products.length} producto(s). ${data.observations || ''}`,
      amount: data.totalAmount,
      cost: 0, // Se puede calcular si es necesario
      status: 'pending',
      paymentMethod: 'cash',
      quantity: data.products.length,
      date: data.deliveryDate
    };

    this.pendingItems.unshift(newPending);
    this.updateFilterCounts();
    this.applyFilter(this.currentFilter);
    this.notificationService.success(`Pendiente de "${data.clientName}" creado exitosamente`, 'Nuevo Pendiente');
  }

  getTotalAmount(): number {
    return this.filteredItems.reduce((sum, item) => sum + item.amount, 0);
  }

  getTotalCost(): number {
    return this.filteredItems.reduce((sum, item) => sum + item.cost, 0);
  }

  getTotalProfit(): number {
    return this.getTotalAmount() - this.getTotalCost();
  }
}
