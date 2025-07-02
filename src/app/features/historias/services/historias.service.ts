import { Injectable } from '@angular/core';
import { environment } from '../../../enviroments/enviroment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ComentarioHistoria,
  CrearComentarioRequest,
  CrearComentarioResponse,
  HistoriaActiva,
  LikeComentarioResponse,
} from '../models/historia';

@Injectable({
  providedIn: 'root',
})
export class HistoriasService {
  private readonly apiUrlHistorias = `${environment.apiUrl}/Historia`;

  constructor(private readonly http: HttpClient) {}

  getHistoriasActivas(): Observable<HistoriaActiva[]> {
    return this.http.get<HistoriaActiva[]>(`${this.apiUrlHistorias}/activas`);
  }

  getComentario(
    comentarioId: number,
    clienteActualId: number
  ): Observable<ComentarioHistoria> {
    const params = new HttpParams().set(
      'clienteActualId',
      clienteActualId.toString()
    );
    return this.http.get<ComentarioHistoria>(
      `${this.apiUrlHistorias}/comentario/${comentarioId}`,
      { params }
    );
  }

  likeComentario(
    comentarioId: number,
    clienteId: number
  ): Observable<LikeComentarioResponse> {
    const params = new HttpParams().set('clienteId', clienteId.toString());
    return this.http.post<LikeComentarioResponse>(
      `${this.apiUrlHistorias}/like-comentario/${comentarioId}`,
      {},
      { params }
    );
  }

  comentarHistoria(
    request: CrearComentarioRequest
  ): Observable<CrearComentarioResponse> {
    return this.http.post<CrearComentarioResponse>(
      `${this.apiUrlHistorias}/comentar`,
      request
    );
  }
}
