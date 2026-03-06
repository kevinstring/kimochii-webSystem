import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface ProductoVenta {
  codigo?: string;
  idProducto?: number;
  cantidad: number;
  precio: number;
  costo?: number;
  descuento?: number;
}

interface DatosVenta {
  tipoIngreso: number;
  tipoPago: number;
  idUsuario: string;
  modo: 'Local' | 'Online';
  descuento?: number;
  montoEfectivo?: number;
  montoBanco?: number;
  productos: ProductoVenta[];
}

interface RespuestaVenta {
  mensaje: string;
  idVenta: number;
  monto: number;
}

interface ProductoResponse {
  producto: {
    NOMBRE: string;
    PRECIO: number;
    CANTIDAD: number;
    ID_PRODUCTO: number;
    COSTO: number;
    CODIGO: string;
  }
}

interface HistorialVentasResponse {
  success: boolean;
  registros: any[];
  totalBanco: number;
  totalCaja: number;
}

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  private apiUrl = 'https://kimochiistore.com/kystem/back/public/'; // Cambiar según tu URL

  constructor(private http: HttpClient) {}

  // Buscar producto por código único
  searchItemByUniqueCode(codigo: string): Observable<ProductoResponse> {
    const formData = new FormData();
    formData.append('codigo', codigo);
    return this.http.post<ProductoResponse>(
      `${this.apiUrl}searchItemByUniqueCode`,
      formData
    );
  }

  // Registrar venta completa
  postDatosIniciales(datosVenta: DatosVenta): Observable<RespuestaVenta> {
    return this.http.post<RespuestaVenta>(
      `${this.apiUrl}postDatos`,
      datosVenta
    );
  }

  // Obtener listado de productos
  getProductos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/productos`);
  }

  // Obtener detalles de un producto por código
  getProductoByCodigo(codigo: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/productos/codigo/${codigo}`);
  }

  // Obtener tipos de ingreso
  getTiposIngreso(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/tipos-ingreso`);
  }

  // Obtener tipos de pago
  getTiposPago(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/tipos-pago`);
  }

  // Obtener historial de ventas con filtros
  getHistorialVentas(filtro: number, idUsuario: number): Observable<HistorialVentasResponse> {
    const formData = new FormData();
    formData.append('idModo', 'Local');
    formData.append('filtro', filtro.toString());
    formData.append('idUsuario', idUsuario.toString());
    return this.http.post<HistorialVentasResponse>(
      `${this.apiUrl}filtros`,
      formData
    );
  }

  getDatos(reference:string){
    return this.http.get<any>(`${this.apiUrl}${reference}`);
  }

  postDatos(reference:string, data:any){
    return this.http.post<any>(`${this.apiUrl}${reference}`, data);
  }

  // Guardar un nuevo pendiente
  postDatosPendientes(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}postDatosPendientes`, data);
  }

  // Obtener pendientes según estado
  getDatosPendientes(tipoModo: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}getDatosPendientes`, { tipoModo });
  }

  // Cambiar estado de un pendiente
  realizarPendiente(data: {
    id: string;
    realizado: number;
    idUsuario: number;
    gasto?: number;
    tipoGasto?: number;
    cobro?: number;
    tipoPago?: number;
  }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}realizarPendiente`, data);
  }

}
