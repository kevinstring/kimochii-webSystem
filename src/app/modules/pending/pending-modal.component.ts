import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotificationService } from '../../services/notification.service';
import { SalesService } from '../../services/sales.service';

interface Product {
  CODIGO: string;
  NOMBRE: string;
  PRECIO: number;
  quantity: number;
}

interface NewPendingData {
  clientName: string;
  clientPhone: string;
  title: string;
  deliveryDate: string;
  products: Product[];
  observations: string;
  totalAmount: number;
}

@Component({
  selector: 'app-pending-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './pending-modal.component.html',
  styleUrl: './pending-modal.component.css'
})
export class PendingModalComponent {
  @Input() isOpen: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<NewPendingData>();

  // Datos del formulario
  clientName: string = '';
  clientPhone: string = '';
  title: string = '';
  deliveryDate: string = '';
  products: Product[] = [];
  observations: string = '';
  totalAmount: number = 0;
  productCode: string = '';

  productSearched:{}={}

  constructor(private notificationService: NotificationService, private salesService: SalesService) {}

  searchProduct() {
    const code = this.productCode.trim().toUpperCase();
    
    if (!code) {
      this.notificationService.warning('Ingresa un código de producto', 'Validación');
      return;
    }

    this.salesService.postDatos('searchItemByUniqueCode', { codigo: code }).subscribe({
      next: (response) => {
        console.log('Producto encontrado:', response);
        
        // Verificar si el producto ya existe
        const existingProduct = this.products.find(p => p.CODIGO === code);
        
        if (existingProduct) {
          existingProduct.quantity += 1;
        } else {
          this.products.push({ ...response.producto, quantity: 1 });
        }
        
        // Calcular total DESPUÉS de agregar el producto
        this.calculateTotal();
        // Limpiar el código DESPUÉS de procesar
        this.productCode = '';
      },
      error: (error) => {
        this.notificationService.error('Producto no encontrado', 'Error');
        console.error('Error al buscar producto:', error);
        this.productCode = '';
      }
    });
  }

  removeProduct(index: number) {
    const product = this.products[index];
    this.products.splice(index, 1);
    this.calculateTotal();
    this.notificationService.info(`${product.NOMBRE} eliminado`, 'Removido');
  }

  updateQuantity(index: number, newQuantity: number) {
    if (newQuantity > 0) {
      this.products[index].quantity = newQuantity;
      this.calculateTotal();
    }
  }

  calculateTotal() {
    const productsTotal = this.products.reduce((sum, p) => sum + (p.PRECIO * p.quantity), 0);
    this.totalAmount = productsTotal;
  }

  clearAll() {
    this.clientName = '';
    this.clientPhone = '';
    this.title = '';
    this.deliveryDate = '';
    this.products = [];
    this.observations = '';
    this.totalAmount = 0;
    this.productCode = '';
    this.notificationService.info('Formulario limpiado', 'Limpiar');
  }

  savePending() {
    // Validaciones
    if (!this.clientName.trim()) {
      this.notificationService.warning('Ingresa el nombre del cliente', 'Validación');
      return;
    }

    if (!this.clientPhone.trim()) {
      this.notificationService.warning('Ingresa el número de teléfono', 'Validación');
      return;
    }

    if (!this.title.trim()) {
      this.notificationService.warning('Ingresa el título del pedido', 'Validación');
      return;
    }

    if (!this.deliveryDate) {
      this.notificationService.warning('Ingresa la fecha de entrega', 'Validación');
      return;
    }

    if (this.products.length === 0) {
      this.notificationService.warning('Agrega al menos un producto', 'Validación');
      return;
    }

    if (this.totalAmount <= 0) {
      this.notificationService.warning('El monto total debe ser mayor a 0', 'Validación');
      return;
    }

    const newPending: NewPendingData = {
      clientName: this.clientName,
      clientPhone: this.clientPhone,
      title: this.title,
      deliveryDate: this.deliveryDate,
      products: this.products,
      observations: this.observations,
      totalAmount: this.totalAmount
    };

    this.save.emit(newPending);
    this.clearAll();
    this.closeModal();
  }

  closeModal() {
    this.close.emit();
  }

  handleKeyPress() {
    this.searchProduct();
  }
}
