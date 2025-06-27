import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../enviroments/enviroment';
import { Observable } from 'rxjs';
import { ProductosResponse } from '../models/productos';

@Injectable({
  providedIn: 'root',
})
export class ProductosService {
  constructor(private readonly http: HttpClient) {}
  private readonly apiUrlProducto = `${environment.apiUrl}/Producto`;

  getProductos(): Observable<ProductosResponse[]> {
    return this.http.get<ProductosResponse[]>(`${this.apiUrlProducto}`);
  }

  getProductosByCategoria(categoria: string): Observable<ProductosResponse[]> {
    return this.http.get<ProductosResponse[]>(
      `${this.apiUrlProducto}/categoria/${categoria}`
    );
  }
}
