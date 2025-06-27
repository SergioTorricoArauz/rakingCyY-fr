import { HttpClient, HttpParams } from '@angular/common/http';
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

  getProductosPaginados(
    categoria?: string,
    search?: string,
    page: number = 1,
    pageSize: number = 20
  ): Observable<{ total: number; productos: ProductosResponse[] }> {
    let params = new HttpParams().set('page', page).set('pageSize', pageSize);

    if (categoria && categoria.trim() !== '') {
      params = params.set('categoria', categoria);
    }

    if (search && search.trim() !== '') {
      params = params.set('search', search);
    }

    return this.http.get<{ total: number; productos: ProductosResponse[] }>(
      `${this.apiUrlProducto}`,
      { params }
    );
  }
}
