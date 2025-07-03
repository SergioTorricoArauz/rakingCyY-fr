import { Component, OnInit, OnDestroy } from '@angular/core';
import { CarritoService } from '../../services/carrito.service';
import { HistorialCarrito } from '../../models/historial-carrito';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-carritos',
  imports: [CommonModule],
  templateUrl: './carritos.component.html',
  styleUrl: './carritos.component.css',
})
export class CarritosComponent implements OnInit, OnDestroy {
  historial: HistorialCarrito[] = [];
  seleccionado: HistorialCarrito | null = null;
  private historialSub!: Subscription;
  private carritoActualizadoSub!: Subscription;
  private historialActualizadoSub!: Subscription;

  constructor(private readonly carritoService: CarritoService) {}

  ngOnInit(): void {
    const userId = Number(localStorage.getItem('currentUserId'));
    if (userId) {
      this.carritoService.inicializar().then(() => {
        this.cargarHistorial(userId);
        this.configurarEventosSignalR();
      });
    }
  }

  private cargarHistorial(userId: number): void {
    this.carritoService.getHistorialCarrito(userId);
  }

  private configurarEventosSignalR(): void {
    this.carritoActualizadoSub =
      this.carritoService.carritoActualizado$.subscribe((carrito) => {
        if (carrito) {
          console.log('Carrito actualizado en tiempo real:', carrito);
        }
      });
    this.historialActualizadoSub =
      this.carritoService.historialActualizado$.subscribe((historial) => {
        console.log('Historial actualizado en tiempo real:', historial);
        this.historial = historial;
      });

    this.historialSub = this.carritoService.historialCarrito$.subscribe(
      (data) => {
        this.historial = data;
      }
    );
  }

  seleccionarCarrito(carrito: HistorialCarrito): void {
    this.seleccionado = carrito;
  }

  ngOnDestroy(): void {
    if (this.historialSub) {
      this.historialSub.unsubscribe();
    }
    if (this.carritoActualizadoSub) {
      this.carritoActualizadoSub.unsubscribe();
    }
    if (this.historialActualizadoSub) {
      this.historialActualizadoSub.unsubscribe();
    }
  }

  get connectionState(): string {
    return this.carritoService.connectionState;
  }
}
