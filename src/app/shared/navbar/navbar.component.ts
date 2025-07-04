import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CarritoService } from '../../features/carritos/services/carrito.service';
import {
  Articulo,
  HistorialCarrito,
} from '../../features/carritos/models/historial-carrito';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  usuarioNombre: string | null = null;
  showCarritoDropdown = false;
  showCrearDropdown = false;
  carritoArticulos: Articulo[] = [];
  carritoActual: HistorialCarrito | null = null;

  private carritoSub!: Subscription;
  private carritoActualizadoSub!: Subscription;
  private historialActualizadoSub!: Subscription;
  private routerSub!: Subscription;

  constructor(
    public authService: AuthService,
    private readonly carritoService: CarritoService,
    private readonly router: Router
  ) {}

  ngOnInit() {
    this.usuarioNombre = this.authService.getCurrentUserNombre();

    this.inicializarCarrito();

    this.routerSub = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.usuarioNombre = this.authService.getCurrentUserNombre();
      }
    });
  }

  private async inicializarCarrito(): Promise<void> {
    const clienteId = this.authService.getCurrentUser()?.id;
    if (typeof clienteId !== 'number') return;

    try {
      await this.carritoService.inicializar();

      this.configurarEventosCarrito(clienteId);

      this.cargarCarritoActual(clienteId);
    } catch (error) {
      console.error('Error al inicializar carrito en navbar:', error);
    }
  }

  private configurarEventosCarrito(clienteId: number): void {
    this.carritoActualizadoSub =
      this.carritoService.carritoActualizado$.subscribe((carrito) => {
        if (carrito) {
          console.log('[Navbar] Carrito actualizado en tiempo real:', carrito);
          this.carritoActual = carrito;
          this.carritoArticulos = carrito.articulos || [];

          this.mostrarNotificacionCarrito('Carrito actualizado');
        }
      });

    this.carritoSub = this.carritoService.carritoActual$.subscribe(
      (carrito) => {
        this.carritoActual = carrito;
        this.carritoArticulos = carrito?.articulos || [];
        console.log('[Navbar] Carrito actual cargado:', carrito);
      }
    );

    this.historialActualizadoSub =
      this.carritoService.historialActualizado$.subscribe((historial) => {
        console.log(
          '[Navbar] Historial actualizado en tiempo real:',
          historial
        );
      });
  }

  private cargarCarritoActual(clienteId: number): void {
    this.carritoService.getCarritoActual(clienteId).subscribe({
      next: (carrito) => {
        this.carritoActual = carrito;
        this.carritoArticulos = carrito.articulos || [];
        console.log('[Navbar] Carrito actual cargado:', carrito);
      },
      error: (error) => {
        console.log('[Navbar] No hay carrito activo o error al cargar:', error);
        this.carritoArticulos = [];
      },
    });
  }

  private loadCarritoArticulos(): void {
    const clienteId = this.authService.getCurrentUser()?.id;
    if (typeof clienteId !== 'number') return;

    this.carritoService.getCarritoActual(clienteId).subscribe({
      next: (cart) => {
        this.carritoArticulos = cart.articulos || [];
      },
      error: (err) => {
        console.error('Error al cargar carrito:', err);
        this.carritoArticulos = [];
      },
    });
  }

  toggleCarritoDropdown(event: Event): void {
    event.preventDefault();
    this.showCarritoDropdown = !this.showCarritoDropdown;
  }

  eliminarProducto(productoId: number): void {
    if (
      !window.confirm(
        '¿Estás seguro de que deseas eliminar este producto del carrito?'
      )
    ) {
      return;
    }

    const clienteId = this.authService.getCurrentUser()?.id;
    if (typeof clienteId !== 'number') return;

    if (this.carritoActual) {
      const carritoId = this.carritoActual.id;
      console.log('Intentando eliminar producto del carrito:', {
        carritoId,
        productoId,
      });

      this.carritoService
        .eliminarProductoDelCarrito(carritoId, productoId, clienteId)
        .subscribe({
          next: (resp) => {
            console.log(
              `Producto ${productoId} eliminado del carrito ${carritoId}:`,
              resp
            );
            this.mostrarNotificacionCarrito('Producto eliminado del carrito');
          },
          error: (err) => {
            console.error('Error al eliminar producto:', err);
            this.mostrarNotificacionCarrito(
              'Error al eliminar producto',
              'error'
            );
          },
        });
    } else {
      this.carritoService.getCarritoActual(clienteId).subscribe({
        next: (carrito) => {
          const carritoId = carrito.id;
          console.log('Intentando eliminar producto del carrito:', {
            carritoId,
            productoId,
          });
          this.carritoService
            .eliminarProductoDelCarrito(carritoId, productoId, clienteId)
            .subscribe({
              next: (resp) => {
                console.log(
                  `Producto ${productoId} eliminado del carrito ${carritoId}:`,
                  resp
                );
                this.mostrarNotificacionCarrito(
                  'Producto eliminado del carrito'
                );
              },
              error: (err) => {
                console.error('Error al eliminar producto:', err);
                this.mostrarNotificacionCarrito(
                  'Error al eliminar producto',
                  'error'
                );
              },
            });
        },
        error: (err) => {
          console.error('Error al obtener carrito:', err);
          this.mostrarNotificacionCarrito('Error al obtener carrito', 'error');
        },
      });
    }
  }

  onLogout(): void {
    this.authService.logout();
  }

  private mostrarNotificacionCarrito(
    mensaje: string,
    tipo: 'success' | 'error' = 'success'
  ): void {
    console.log(`[Navbar] ${tipo === 'success' ? 'Bien' : 'Mal'} ${mensaje}`);
  }

  get totalProductosCarrito(): number {
    return this.carritoArticulos.length;
  }

  get totalCarrito(): number {
    return this.carritoArticulos.reduce((total, articulo) => {
      return total + articulo.precioUnitario * articulo.cantidad;
    }, 0);
  }

  ngOnDestroy(): void {
    if (this.carritoSub) {
      this.carritoSub.unsubscribe();
    }
    if (this.carritoActualizadoSub) {
      this.carritoActualizadoSub.unsubscribe();
    }
    if (this.historialActualizadoSub) {
      this.historialActualizadoSub.unsubscribe();
    }
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
  }

  get connectionState(): string {
    return this.carritoService.connectionState;
  }
}
