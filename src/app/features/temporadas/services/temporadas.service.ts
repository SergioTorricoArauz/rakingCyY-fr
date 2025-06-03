import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../enviroments/enviroment';
import { Temporada } from '../models/temporada';

@Injectable({
  providedIn: 'root'
})
export class TemporadasService {
  private readonly apiUrl = `${environment.apiUrl}/Temporada`;

  constructor(private http: HttpClient) { }

  getTemporadas() {
    return this.http.get<Temporada[]>(this.apiUrl);
}

getTemporadaById(id: number) {
  return this.http.get<Temporada>(`${this.apiUrl}/${id}`);
}
}
