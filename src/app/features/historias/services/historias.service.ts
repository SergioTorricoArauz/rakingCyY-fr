import { Injectable, OnDestroy } from '@angular/core';
import { environment } from '../../../enviroments/enviroment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
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
export class HistoriasService implements OnDestroy {
  private readonly apiUrlHistorias = `${environment.apiUrl}/Historia`;
  private hubConnection: HubConnection | null = null;
  private connectionStarted = false;

  // Subjects para eventos en tiempo real
  private readonly nuevaHistoriaSubject =
    new BehaviorSubject<HistoriaActiva | null>(null);
  private readonly nuevoComentarioSubject = new BehaviorSubject<{
    historiaId: number;
    comentario: ComentarioHistoria;
  } | null>(null);
  private readonly comentarioLikeActualizadoSubject = new BehaviorSubject<{
    comentarioId: number;
    likes: number;
    isLike: boolean;
  } | null>(null);

  // Observables públicos para suscribirse a eventos
  public nuevaHistoria$ = this.nuevaHistoriaSubject.asObservable();
  public nuevoComentario$ = this.nuevoComentarioSubject.asObservable();
  public comentarioLikeActualizado$ =
    this.comentarioLikeActualizadoSubject.asObservable();

  constructor(private readonly http: HttpClient) {}

  // Agregar un método público para inicializar
  public async inicializar(): Promise<void> {
    if (!this.connectionStarted) {
      await this.inicializarSignalR();
    }
  }

  private async inicializarSignalR(): Promise<void> {
    try {
      this.hubConnection = new HubConnectionBuilder()
        .withUrl(`${environment.apiUrl}/historiahub`)
        .build();

      // Configurar listeners de eventos
      this.hubConnection.on('NuevaHistoria', (historia: HistoriaActiva) => {
        console.log('Nueva historia recibida via SignalR:', historia);
        this.nuevaHistoriaSubject.next(historia);
      });

      this.hubConnection.on(
        'NuevoComentario',
        (historiaId: number, comentario: ComentarioHistoria) => {
          console.log('Nuevo comentario recibido via SignalR:', {
            historiaId,
            comentario,
          });
          this.nuevoComentarioSubject.next({ historiaId, comentario });
        }
      );

      this.hubConnection.on(
        'ComentarioLikeActualizado',
        (comentarioId: number, likes: number, isLike: boolean) => {
          console.log('Like actualizado via SignalR:', {
            comentarioId,
            likes,
            isLike,
          });
          this.comentarioLikeActualizadoSubject.next({
            comentarioId,
            likes,
            isLike,
          });
        }
      );

      // Configurar eventos de conexión
      this.hubConnection.onclose(async () => {
        console.log('Conexión SignalR cerrada. Reintentando...');
        this.connectionStarted = false;
        await this.reconectar();
      });

      await this.hubConnection.start();
      this.connectionStarted = true;
      console.log('Conexión SignalR establecida exitosamente');
    } catch (err) {
      console.error('Error al inicializar SignalR:', err);
      await this.reconectar();
    }
  }

  private async reconectar(): Promise<void> {
    if (this.connectionStarted) return;

    try {
      await new Promise((resolve) => setTimeout(resolve, 3000)); // Esperar 3 segundos
      await this.inicializarSignalR();
    } catch (err) {
      console.error('Error al reconectar SignalR:', err);
    }
  }

  async unirseAGrupoHistoria(historiaId: number): Promise<void> {
    if (this.hubConnection?.state === 'Connected') {
      try {
        await this.hubConnection.invoke(
          'JoinHistoryGroup',
          historiaId.toString()
        );
        console.log(`Unido al grupo Historia_${historiaId}`);
      } catch (err) {
        console.error('Error al unirse al grupo de historia:', err);
      }
    } else {
      console.warn('No hay conexión SignalR disponible para unirse al grupo');
    }
  }

  async salirDeGrupoHistoria(historiaId: number): Promise<void> {
    if (this.hubConnection?.state === 'Connected') {
      try {
        await this.hubConnection.invoke(
          'LeaveHistoryGroup',
          historiaId.toString()
        );
        console.log(`Salió del grupo Historia_${historiaId}`);
      } catch (err) {
        console.error('Error al salir del grupo de historia:', err);
      }
    }
  }

  // Métodos HTTP existentes (mantienen la misma funcionalidad)
  getHistoriasActivas(clienteActualId?: number): Observable<HistoriaActiva[]> {
    let params = new HttpParams();
    if (clienteActualId) {
      params = params.set('clienteActualId', clienteActualId.toString());
    }
    return this.http.get<HistoriaActiva[]>(`${this.apiUrlHistorias}/activas`, {
      params,
    });
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

  // Método para obtener una historia específica
  getHistoria(
    id: number,
    clienteActualId?: number
  ): Observable<HistoriaActiva> {
    let params = new HttpParams();
    if (clienteActualId) {
      params = params.set('clienteActualId', clienteActualId.toString());
    }
    return this.http.get<HistoriaActiva>(`${this.apiUrlHistorias}/${id}`, {
      params,
    });
  }

  // Método para verificar el estado de la conexión
  get connectionState(): string {
    return this.hubConnection?.state ?? 'Disconnected';
  }

  // Cleanup al destruir el servicio
  ngOnDestroy(): void {
    if (this.hubConnection) {
      this.hubConnection.stop();
      console.log('Conexión SignalR terminada');
    }
  }
}
