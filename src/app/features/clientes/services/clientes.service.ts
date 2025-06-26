import { Injectable } from '@angular/core';
import { environment } from '../../../enviroments/enviroment';
import { HttpClient } from '@angular/common/http';
import { ClientesPost } from '../models/clientes';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClientesService {
  private readonly apiUrlCliente = `${environment.apiUrl}/Cliente`;

  constructor(private readonly http: HttpClient) {}

  registerCliente(cliente: ClientesPost): Observable<ClientesPost> {
    return this.http.post<ClientesPost>(
      `${this.apiUrlCliente}/register`,
      cliente
    );
  }
}
