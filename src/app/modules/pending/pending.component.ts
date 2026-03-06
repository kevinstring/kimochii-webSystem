import { Component, OnInit, ChangeDetectorRef, NgZone, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../services/notification.service';
import { PendingModalComponent } from './pending-modal.component';
import { SalesService } from '../../services/sales.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-pending',
  standalone: true,
  imports: [CommonModule, FormsModule, PendingModalComponent],
  templateUrl: './pending.component.html',
  styleUrl: './pending.component.css'
})
export class PendingComponent implements OnInit {
  pendingItems: any[] = [];
  filteredItems: any[] = [];
  isLoading = false;
  isModalOpen = false;
  currentFilter = 5;

  filterTabs = [
    { key: 5, label: 'Todos', icon: 'pi-list', count: 0 },
    { key: 1, label: 'Pendientes', icon: 'pi-hourglass', count: 0 },
    { key: 2, label: 'En Proceso', icon: 'pi-spinner', count: 0 },
    { key: 3, label: 'Realizados', icon: 'pi-check', count: 0 }
  ];

  constructor(
    private notificationService: NotificationService,
    private salesService: SalesService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.applyFilter(1);
  }

  loadPendingItems() {
    this.isLoading = true;
    this.salesService.getDatosPendientes(1).subscribe({
      next: (response) => {
        console.log('Datos del backend:', response.resultado);
     
          this.pendingItems = response.resultado;
          window.alert("Hola")

        this.filteredItems = [...this.pendingItems];
        this.updateFilterCounts();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error:', error);
        this.notificationService.error('Error al cargar pendientes', 'Error');
        this.isLoading = false;
      }
    });
  }

  updateFilterCounts() {
    this.filterTabs[0].count = this.pendingItems.length;
    this.filterTabs[1].count = this.pendingItems.filter(i => i.status === 1).length;
    this.filterTabs[2].count = this.pendingItems.filter(i => i.status === 2).length;
    this.filterTabs[3].count = this.pendingItems.filter(i => i.status === 3).length;
  }

  applyFilter(filter: number) {
    this.currentFilter = filter;
    this.isLoading = true;
    
    this.salesService.getDatosPendientes(filter).subscribe({
      next: (response) => {
        console.log('Datos del backend para filtro', filter, ':', response.resultado);
        console.log('Primer item:', response.resultado[0]);
        
        // Usar NgZone para asegurar detección de cambios en SSR
        this.ngZone.run(() => {
          this.filteredItems = (response.resultado || []).map((item: any) => {
            let mapped = {
              id: item.ID_PENDIENTE?.toString() || '',
              client: item.NOMBRE_CLIENTE || 'Sin nombre',
              clientInitial: (item.NOMBRE_CLIENTE || 'X').charAt(0).toUpperCase(),
              title: item.TITULO || 'Sin título',
              details: item.DETALLE || 'Sin detalle',
              amount: parseFloat(item.COBRO) || 0,
              cost: parseFloat(item.GASTO) || 0,
              quantity: 1,
              status: item.ID_ESTADO_PENDIENTE || 1,
              date: item.FECHA_APROX || item.FECHA_REGISTRO || 'Sin fecha',
              clientPhone: item.NUMERO_TELEFONO || ''
            };
            console.log('Item mapeado:', mapped);
            return mapped;
          });
          
          console.log('Array final filteredItems:', this.filteredItems);
          
          // Para el conteo de tabs, solo usamos los datos del filtro "Todos" 
          if (filter === 5) {
            this.pendingItems = [...this.filteredItems];
            this.updateFilterCounts();
          }
          
          this.isLoading = false;
          
          // Solo detectar cambios si estamos en el browser
          if (isPlatformBrowser(this.platformId)) {
            this.cdr.detectChanges();
          }
        });
      },
      error: (error) => {
        console.error('Error:', error);
        this.notificationService.error('Error al cargar pendientes', 'Error');
        this.isLoading = false;
      }
    });
  }

  getStatusLabel(status: number): string {
    return status === 1 ? 'Pendiente' : status === 2 ? 'En Proceso' : 'Realizado';
  }

  updateStatus(item: any, newStatus: number) {
    this.salesService.getDatosPendientes(newStatus).subscribe({
      next: () => {
        this.notificationService.success('Estado actualizado', 'Actualizado');
        this.applyFilter(this.currentFilter);
      },
      error: (error) => {
        console.error('Error:', error);
        this.notificationService.error('Error al actualizar', 'Error');
      }
    });
  }

  addNewPending() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  onSaveNewPending(data: any) {
    const userId = this.authService.getCurrentUser()?.id || 0;
    
    this.salesService.postDatosPendientes({
      numeroCliente: data.clientPhone,
      nombreCliente: data.clientName,
      titulo: data.title,
      detalle: data.observations || '',
      cobro: data.totalAmount,
      fechaEntrega: data.deliveryDate,
      id_estado_pendiente: 1,
      productos: JSON.stringify(data.products),
      idUsuario: userId
    }).subscribe({
      next: () => {
        this.notificationService.success('Pendiente creado', 'Nuevo Pendiente');
        this.loadPendingItems();
      },
      error: (error) => {
        console.error('Error:', error);
        this.notificationService.error('Error al guardar', 'Error');
      }
    });
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

  getPaymentMethodLabel(method: string): string {
    return 'Efectivo';
  }

  updateQuantity(item: any, newQuantity: number) {
    // No hacer nada
  }

  deletePending(item: any) {
    // No hacer nada
  }
}
