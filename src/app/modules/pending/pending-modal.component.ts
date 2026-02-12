import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../services/notification.service';

interface Product {
  code: string;
  name: string;
  price: number;
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
  imports: [CommonModule, FormsModule],
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

  // Simulación de productos disponibles
  availableProducts: { [key: string]: { name: string; price: number } } = {
    'SUB001': { name: 'Sublimadora A4', price: 150.00 },
    'SUB002': { name: 'Sublimadora A3', price: 250.00 },
    'TINTA001': { name: 'Tinta Magenta', price: 25.00 },
    'TINTA002': { name: 'Tinta Cian', price: 25.00 },
    'PAPEL001': { name: 'Papel Transfer A4', price: 0.50 },
    'PAPEL002': { name: 'Papel Transfer A3', price: 0.75 },
    'PLOTTER001': { name: 'Plotter de Corte 24"', price: 350.00 },
    'VINILO001': { name: 'Vinilo Adhesivo Blanco', price: 8.00 }
  };

  constructor(private notificationService: NotificationService) {}

  searchProduct() {
    const code = this.productCode.trim().toUpperCase();
    
    if (!code) {
      this.notificationService.warning('Ingresa un código de producto', 'Validación');
      return;
    }

    const product = this.availableProducts[code];
    
    if (!product) {
      this.notificationService.error(`Producto "${code}" no encontrado`, 'Producto no encontrado');
      this.productCode = '';
      return;
    }

    // Verificar si el producto ya existe
    const existingProduct = this.products.find(p => p.code === code);
    
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      this.products.push({
        code: code,
        name: product.name,
        price: product.price,
        quantity: 1
      });
    }

    this.calculateTotal();
    this.productCode = '';
    this.notificationService.success(`${product.name} agregado`, 'Producto añadido');
  }

  removeProduct(index: number) {
    const product = this.products[index];
    this.products.splice(index, 1);
    this.calculateTotal();
    this.notificationService.info(`${product.name} eliminado`, 'Removido');
  }

  updateQuantity(index: number, newQuantity: number) {
    if (newQuantity > 0) {
      this.products[index].quantity = newQuantity;
      this.calculateTotal();
    }
  }

  calculateTotal() {
    const productsTotal = this.products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
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

  handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.searchProduct();
    }
  }
}
