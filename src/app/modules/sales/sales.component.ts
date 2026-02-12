import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

interface Product {
  code: string;
  name: string;
  price: number;
}

interface SalesItem {
  code: string;
  product: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface PaymentMethod {
  id: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.css'
})
export class SalesComponent implements OnInit {
  productCode: string = '';
  paymentMethod: string = 'cash';
  salesItems: SalesItem[] = [];
  totalSale: number = 0;
  errorMessage: string = '';
  isLoading: boolean = false;

  paymentMethods: PaymentMethod[] = [
    { id: 'cash', label: 'Efectivo', icon: 'pi-dollar' },
    { id: 'card', label: 'Tarjeta', icon: 'pi-credit-card' },
    { id: 'mixed', label: 'Mixto (Efectivo + Tarjeta)', icon: 'pi-inbox' }
  ];

  // Simulación de productos disponibles (en real viene del backend)
  products: Product[] = [
    { code: 'SUB001', name: 'Sublimadora A4', price: 150.00 },
    { code: 'SUB002', name: 'Sublimadora A3', price: 250.00 },
    { code: 'TINTA001', name: 'Tinta Magenta', price: 25.00 },
    { code: 'TINTA002', name: 'Tinta Cian', price: 25.00 },
    { code: 'PAPEL001', name: 'Papel Transfer A4', price: 0.50 },
    { code: 'PAPEL002', name: 'Papel Transfer A3', price: 0.75 },
    { code: 'PLOTTER001', name: 'Plotter de Corte 24"', price: 350.00 },
    { code: 'VINILO001', name: 'Vinilo Adhesivo Blanco', price: 8.00 }
  ];

  constructor(private authService: AuthService, private notificationService: NotificationService) {}

  ngOnInit() {}

  searchProduct() {
    this.errorMessage = '';
    
    if (!this.productCode.trim()) {
      this.errorMessage = 'Por favor ingresa un código de producto';
      this.notificationService.warning(this.errorMessage, 'Validación');
      return;
    }

    const product = this.products.find(p => p.code.toUpperCase() === this.productCode.toUpperCase());

    if (!product) {
      this.errorMessage = `Producto con código "${this.productCode}" no encontrado`;
      this.notificationService.error(this.errorMessage, 'Producto no encontrado');
      this.productCode = '';
      return;
    }

    // Verificar si el producto ya está en la tabla
    const existingItem = this.salesItems.find(item => item.code === product.code);

    if (existingItem) {
      // Incrementar cantidad
      existingItem.quantity += 1;
      existingItem.total = existingItem.quantity * existingItem.unitPrice;
      this.notificationService.info(`${product.name} - Cantidad: ${existingItem.quantity}`, 'Actualizado');
    } else {
      // Agregar nuevo producto
      const newItem: SalesItem = {
        code: product.code,
        product: product.name,
        quantity: 1,
        unitPrice: product.price,
        total: product.price
      };
      this.salesItems.push(newItem);
      this.notificationService.success(`${product.name} agregado a la venta`, 'Producto añadido');
    }

    this.calculateTotal();
    this.productCode = '';
  }

  updateQuantity(index: number, newQuantity: number) {
    if (newQuantity > 0) {
      this.salesItems[index].quantity = newQuantity;
      this.salesItems[index].total = newQuantity * this.salesItems[index].unitPrice;
      this.calculateTotal();
    }
  }

  removeItem(index: number) {
    this.salesItems.splice(index, 1);
    this.calculateTotal();
  }

  calculateTotal() {
    this.totalSale = this.salesItems.reduce((sum, item) => sum + item.total, 0);
  }

  completeSale() {
    if (this.salesItems.length === 0) {
      this.notificationService.warning('Agrega productos antes de completar la venta', 'Sin productos');
      return;
    }

    if (!this.paymentMethod) {
      this.notificationService.error('Selecciona un método de pago', 'Validación');
      return;
    }

    this.isLoading = true;
    const currentUser = this.authService.getCurrentUser();
    
    // Datos de la venta listos para enviar al backend
    const saleData = {
      userId: currentUser?.id,
      userName: currentUser?.name,
      items: this.salesItems,
      total: this.totalSale,
      paymentMethod: this.paymentMethod,
      date: new Date()
    };

    // Simular petición al backend (reemplazar con API real)
    setTimeout(() => {
      try {
        console.log('Venta para enviar al backend:', saleData);
        
        const paymentMethodLabel = this.paymentMethods.find(p => p.id === this.paymentMethod)?.label || 'Desconocido';
        this.notificationService.success(
          `Venta registrada correctamente (${paymentMethodLabel})`,
          'Venta Exitosa'
        );
        
        this.salesItems = [];
        this.totalSale = 0;
        this.paymentMethod = 'cash';
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        this.notificationService.error('No se pudo registrar la venta. Intenta de nuevo.', 'Error');
      }
    }, 1000);
  }
}
