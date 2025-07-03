import { Injectable, OnDestroy } from '@angular/core';
import { environment } from '../../../enviroments/enviroment';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, switchMap, map } from 'rxjs';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import {
  AgregarProductoCarrito,
  CrearCarrito,
  HistorialCarrito,
} from '../models/historial-carrito';

@Injectable({
  providedIn: 'root',
})
export class CarritoService implements OnDestroy {
  private readonly apiUrlCarritoService = `${environment.apiUrl}/Carrito`;
  private hubConnection: HubConnection | null = null;
  private connectionStarted = false;

  private readonly carritoActualSubject =
    new BehaviorSubject<HistorialCarrito | null>(null);
  carritoActual$ = this.carritoActualSubject.asObservable();

  private readonly historialCarritoSubject = new BehaviorSubject<
    HistorialCarrito[]
  >([]);
  historialCarrito$ = this.historialCarritoSubject.asObservable();

  private readonly carritoActualizadoSubject =
    new BehaviorSubject<HistorialCarrito | null>(null);
  carritoActualizado$ = this.carritoActualizadoSubject.asObservable();

  private readonly historialActualizadoSubject = new BehaviorSubject<
    HistorialCarrito[]
  >([]);
  historialActualizado$ = this.historialActualizadoSubject.asObservable();

  constructor(private readonly http: HttpClient) {}

  public async inicializar(): Promise<void> {
    if (!this.connectionStarted) {
      await this.inicializarSignalR();
    }
  }

  private async inicializarSignalR(): Promise<void> {
    try {
      this.hubConnection = new HubConnectionBuilder()
        .withUrl(`${environment.apiUrl}/carritohub`)
        .build();

      this.hubConnection.on(
        'CarritoActualizado',
        (carrito: HistorialCarrito) => {
          console.log('Carrito actualizado via SignalR:', carrito);
          this.carritoActualizadoSubject.next(carrito);
          this.carritoActualSubject.next(carrito);
        }
      );

      this.hubConnection.on(
        'HistorialActualizado',
        (historial: HistorialCarrito[]) => {
          console.log('Historial actualizado via SignalR:', historial);
          this.historialActualizadoSubject.next(historial);
          this.historialCarritoSubject.next(historial);
        }
      );

      this.hubConnection.onclose(async () => {
        console.log('Conexión SignalR del carrito cerrada. Reintentando...');
        this.connectionStarted = false;
        await this.reconectar();
      });

      await this.hubConnection.start();
      this.connectionStarted = true;
      console.log('Conexión SignalR del carrito establecida exitosamente');
    } catch (err) {
      console.error('Error al inicializar SignalR del carrito:', err);
      await this.reconectar();
    }
  }

  private async reconectar(): Promise<void> {
    if (this.connectionStarted) return;

    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      await this.inicializarSignalR();
    } catch (err) {
      console.error('Error al reconectar SignalR del carrito:', err);
    }
  }

  getHistorialCarrito(clienteId: number): void {
    this.http
      .get<HistorialCarrito[]>(
        `${this.apiUrlCarritoService}/historial/${clienteId}`
      )
      .subscribe((data) => {
        this.historialCarritoSubject.next(data);
      });
  }

  crearCarrito(carrito: CrearCarrito): Observable<any> {
    return this.http.post<any>(`${this.apiUrlCarritoService}/crear`, carrito);
  }

  getCarritoActual(clienteId: number): Observable<HistorialCarrito> {
    return this.http
      .get<HistorialCarrito>(`${this.apiUrlCarritoService}/${clienteId}`)
      .pipe(tap((carrito) => this.carritoActualSubject.next(carrito)));
  }

  eliminarProductoDelCarrito(
    carritoId: number,
    productoId: number,
    clienteId: number
  ): Observable<string> {
    return this.http
      .delete(
        `${this.apiUrlCarritoService}/quitar-producto/${carritoId}/${productoId}`,
        { responseType: 'text' }
      )
      .pipe(
        switchMap(() => this.getCarritoActual(clienteId)),
        tap((carrito) => this.carritoActualSubject.next(carrito)),
        map(() => 'Producto eliminado')
      );
  }

  agregarProductoAlCarrito(
    producto: AgregarProductoCarrito,
    clienteId: number
  ): Observable<string> {
    return this.http
      .post(`${this.apiUrlCarritoService}/agregar-producto`, producto, {
        responseType: 'text',
      })
      .pipe(
        switchMap(() => this.getCarritoActual(clienteId)),
        tap((carrito) => this.carritoActualSubject.next(carrito)),
        map(() => 'Producto agregado')
      );
  }

  get connectionState(): string {
    return this.hubConnection?.state ?? 'Disconnected';
  }

  ngOnDestroy(): void {
    if (this.hubConnection) {
      this.hubConnection.stop();
      console.log('Conexión SignalR del carrito terminada');
    }
  }
}
