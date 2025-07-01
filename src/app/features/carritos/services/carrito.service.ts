import { Injectable } from '@angular/core';
import { environment } from '../../../enviroments/enviroment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CrearCarrito, HistorialCarrito } from '../models/historial-carrito';

@Injectable({
  providedIn: 'root',
})
export class CarritoService {
  private readonly apiUrlCarritoService = `${environment.apiUrl}/Carrito`;

  constructor(private readonly http: HttpClient) {}

  getHistorialCarrito(clienteId: number): Observable<HistorialCarrito[]> {
    return this.http.get<HistorialCarrito[]>(
      `${this.apiUrlCarritoService}/historial/${clienteId}`
    );
  }

  crearCarrito(carrito: CrearCarrito): Observable<any> {
    return this.http.post<any>(`${this.apiUrlCarritoService}/crear`, carrito);
  }

  getCarritoActual(clienteId: number): Observable<HistorialCarrito> {
    return this.http.get<HistorialCarrito>(
      `${this.apiUrlCarritoService}/${clienteId}`
    );
  }

  eliminarProductoDelCarrito(
    carritoId: number,
    productoId: number
  ): Observable<any> {
    return this.http.delete<any>(
      `${this.apiUrlCarritoService}/quitar-producto/${carritoId}/${productoId}`
    );
  }
}
