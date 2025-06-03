import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../enviroments/enviroment';
import { Observable } from 'rxjs';
import { Insignias } from '../models/insignias';

@Injectable({
  providedIn: 'root'
})
export class InsigniasService {
  private readonly apiUrlCliente = `${environment.apiUrl}/Cliente`;

  constructor(private http: HttpClient) { }

  getInsigniasPorCliente(clienteId: number): Observable<Insignias[]> {
    return this.http.get<Insignias[]>(
      `${this.apiUrlCliente}/${clienteId}/insignias`
    );
  }
}
