import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../enviroments/enviroment';
import { Actividad } from '../models/actividades';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActividadesService {
  private readonly apiUrl = `${environment.apiUrl}/api/Actividades`;

  constructor(private http: HttpClient) { }

  getActividades(): Observable<Actividad[]> {
    return this.http.get<Actividad[]>(`${this.apiUrl}/actividades`);
  }
  participarActividad(clienteId: number, actividadId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/participar`, { clienteId, actividadId });
  }
}
