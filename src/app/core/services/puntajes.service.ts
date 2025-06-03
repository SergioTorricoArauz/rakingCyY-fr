import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../enviroments/enviroment';
import { Observable } from 'rxjs';
import { Puntaje } from '../../models/puntaje';

@Injectable({
  providedIn: 'root'
})
export class PuntajesService {
  private readonly apiUrl = `${environment.apiUrl}/Puntaje/ranking/temporada`;

  constructor(private http: HttpClient) { }

  getRanking(temporadaId: number): Observable<Puntaje[]> {
    return this.http.get<Puntaje[]>(`${this.apiUrl}/${temporadaId}`);
  }

}
