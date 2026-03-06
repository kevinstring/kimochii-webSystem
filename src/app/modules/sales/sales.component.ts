import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { SalesService } from '../../services/sales.service';

interface SalesItem {
  code: string;
  product: string;
  quantity: number;
  unitPrice: number;
  cost: number;
  total: number;
  idProducto: number;
  stock: number;
}

interface PaymentMethod {
  id: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.css'
})
export class SalesComponent implements OnInit {
  productCode: string = '';
  tipoIngreso: number = 1; // Siempre 1 (Venta)
  tipoPago: number = 1; // 1 = Efectivo, 2 = Banco, 3 = Mixto
  
  // Montos separados para mixto
  montoEfectivo: number = 0;
  montoBanco: number = 0;
  
  salesItems: SalesItem[] = [];
  totalSale: number = 0;
  errorMessage: string = '';
  isLoading: boolean = false;
  isSearching: boolean = false;

  // Tipos de pago simplificados
  paymentMethods: PaymentMethod[] = [
    { id: 'efectivo', label: 'Efectivo', icon: 'pi-dollar' },
    { id: 'banco', label: 'Tarjeta', icon: 'pi-credit-card' }
  ];

  constructor(
    private authService: AuthService,
    private salesService: SalesService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // tipoIngreso siempre es 1 (Venta)
    this.tipoIngreso = 1;
  }

searchProduct() {
  this.errorMessage = '';

  const code = this.productCode.trim();
  if (!code) return;

  this.isSearching = true;
  console.log('[1] buscando:', code);

  this.salesService.searchItemByUniqueCode(code).subscribe({
    next: (response) => {
      const producto = response.producto;
      console.log('[2] producto:', producto);

      if (producto.CANTIDAD <= 0) {
        this.errorMessage = `sin stock disponible para "${producto.NOMBRE}"`;
        this.isSearching = false;
        this.productCode = '';
        this.cdr.detectChanges();
        return;
      }

      const index = this.salesItems.findIndex(
        item => item.code === producto.CODIGO
      );

      // 🔁 producto ya existe
      if (index !== -1) {
        const item = this.salesItems[index];

        if (item.quantity + 1 > producto.CANTIDAD) {
          this.errorMessage = `stock insuficiente. disponible: ${producto.CANTIDAD}`;
          this.isSearching = false;
          this.productCode = '';
          this.cdr.detectChanges();
          return;
        }

        const updatedItem: SalesItem = {
          ...item,
          quantity: item.quantity + 1,
          total: (item.quantity + 1) * item.unitPrice
        };

        this.salesItems = this.salesItems.map((i, idx) =>
          idx === index ? updatedItem : i
        );

      } 
      // ➕ producto nuevo
      else {
        const newItem: SalesItem = {
          code: producto.CODIGO,
          product: producto.NOMBRE,
          quantity: 1,
          unitPrice: producto.PRECIO,
          cost: producto.COSTO,
          total: producto.PRECIO,
          idProducto: producto.ID_PRODUCTO,
          stock: producto.CANTIDAD
        };

        this.salesItems = [...this.salesItems, newItem];
      }

      this.calculateTotal();
      this.productCode = '';
      this.isSearching = false;
      this.cdr.detectChanges();
    },
    error: (error) => {
      console.error('[error busqueda]', error);
      this.errorMessage =
        error?.error?.mensaje ||
        error?.error?.error ||
        `producto "${code}" no encontrado`;
      this.isSearching = false;
      this.productCode = '';
      this.cdr.detectChanges();
    },
    complete: () => {
      console.log('[finalizado]');
    }
  });
}

  updateQuantity(index: number, newQuantity: number) {
    const item = this.salesItems[index];
    
    if (newQuantity > 0 && newQuantity <= item.stock) {
      item.quantity = newQuantity;
      this.recalculateItemTotal(index);
    } else if (newQuantity > item.stock) {
      item.quantity = item.stock;
      this.recalculateItemTotal(index);
    }
  }

  recalculateItemTotal(index: number) {
    const item = this.salesItems[index];
    item.total = item.quantity * item.unitPrice;
    this.calculateTotal();
    this.distribuirTotal();
  }

  removeItem(index: number) {
    this.salesItems.splice(index, 1);
    this.calculateTotal();
    this.distribuirTotal();
  }

  calculateTotal() {
    this.totalSale = this.salesItems.reduce((sum, item) => sum + item.total, 0);
    this.distribuirTotal();
  }

  onTipoPagoChange() {
    this.distribuirTotal();
  }

  // Actualizar montos cuando cambia efectivo
  updateMontoEfectivo() {
    if (this.montoEfectivo < 0) {
      this.montoEfectivo = 0;
    }
    // Si efectivo + banco > total, ajustar banco
    if (this.montoEfectivo + this.montoBanco > this.totalSale) {
      this.montoBanco = this.totalSale - this.montoEfectivo;
    }
  }

  // Actualizar montos cuando cambia banco
  updateMontoBanco() {
    if (this.montoBanco < 0) {
      this.montoBanco = 0;
    }
    // Si efectivo + banco > total, ajustar efectivo
    if (this.montoEfectivo + this.montoBanco > this.totalSale) {
      this.montoEfectivo = this.totalSale - this.montoBanco;
    }
  }

  // Distribuir total entre efectivo y banco automáticamente según tipo de pago
  distribuirTotal() {
    if (this.tipoPago === 1) {
      // Solo efectivo
      this.montoEfectivo = this.totalSale;
      this.montoBanco = 0;
    } else if (this.tipoPago === 2) {
      // Solo banco
      this.montoEfectivo = 0;
      this.montoBanco = this.totalSale;
    } else if (this.tipoPago === 3) {
      // Mixto: distribuir a mitad y mitad (opcional, usuario puede cambiar)
      this.montoEfectivo = Math.round((this.totalSale / 2) * 100) / 100;
      this.montoBanco = Math.round((this.totalSale / 2) * 100) / 100;
    }
  }

  completeSale() {
    if (this.salesItems.length === 0) {
      this.errorMessage = 'Agrega productos antes de completar la venta';
      return;
    }

    if (!this.tipoPago) {
      this.errorMessage = 'Selecciona un método de pago';
      return;
    }

    // Validar según el tipo de pago
    if (this.tipoPago === 1) {
      const totalEfectivo = Math.round(this.montoEfectivo * 100) / 100;
      const totalVenta = Math.round(this.totalSale * 100) / 100;
      
      if (totalEfectivo !== totalVenta) {
        this.errorMessage = `Para pago en Efectivo, el monto debe ser exacto: Q${totalVenta.toFixed(2)}`;
        return;
      }
    } else if (this.tipoPago === 2) {
      const totalBanco = Math.round(this.montoBanco * 100) / 100;
      const totalVenta = Math.round(this.totalSale * 100) / 100;
      
      if (totalBanco !== totalVenta) {
        this.errorMessage = `Para pago en Tarjeta, el monto debe ser exacto: Q${totalVenta.toFixed(2)}`;
        return;
      }
    } else if (this.tipoPago === 3) {
      if (this.montoEfectivo <= 0 && this.montoBanco <= 0) {
        this.errorMessage = 'Para pago Mixto, ingresa al menos un monto (Efectivo o Banco)';
        return;
      }
    }

    this.isLoading = true;
    this.errorMessage = '';
    const currentUser = this.authService.getCurrentUser();

    const productosParaEnviar = this.salesItems.map(item => ({
      codigo: item.code,
      cantidad: item.quantity,
      precio: item.unitPrice,
      costo: item.cost,
      idProducto: item.idProducto
    }));

    const datosVenta: any = {
      tipoIngreso: 1,
      tipoPago: this.tipoPago,
      idUsuario: currentUser?.id?.toString() || '0',
      modo: 'Local',
      productos: productosParaEnviar
    };

    if (this.tipoPago === 1) {
      datosVenta.montoEfectivo = this.montoEfectivo;
      datosVenta.montoBanco = 0;
    } else if (this.tipoPago === 2) {
      datosVenta.montoEfectivo = 0;
      datosVenta.montoBanco = this.montoBanco;
    } else if (this.tipoPago === 3) {
      datosVenta.montoEfectivo = this.montoEfectivo;
      datosVenta.montoBanco = this.montoBanco;
    }

    this.salesService.postDatosIniciales(datosVenta).subscribe(
      (respuesta) => {
        this.isLoading = false;
        
        // Limpiar formulario
        this.salesItems = [];
        this.totalSale = 0;
        this.tipoPago = 1;
        this.montoEfectivo = 0;
        this.montoBanco = 0;
        this.productCode = '';
        this.errorMessage = '';
      },
      (error) => {
        this.isLoading = false;
        const mensajeError = error?.error?.mensaje || error?.error?.error || 'Error al registrar la venta';
        this.errorMessage = mensajeError;
      }
    );
  }
}
