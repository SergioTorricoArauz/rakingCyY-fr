import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductosService } from '../../services/productos.service';
import { ProductosResponse } from '../../models/productos';
import { catchError, Subscription, switchMap, throwError } from 'rxjs';
import {
  AgregarProductoCarrito,
  CrearCarrito,
} from '../../../carritos/models/historial-carrito';
import { CarritoService } from '../../../carritos/services/carrito.service';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css',
})
export class ProductosComponent implements OnInit, OnDestroy {
  productos: ProductosResponse[] = [];
  categoriasUnicas: { id: string; nombre: string }[] = [];
  terminoBusqueda: string = '';
  categoriaSeleccionada: string = '';
  cargando: boolean = true;
  totalProductos: number = 0;
  paginaActual: number = 1;
  pageSize: number = 20;

  // Variables para el carrito
  carritoActual: any = null;
  private carritoSub!: Subscription;
  private carritoActualizadoSub!: Subscription;

  categoriasMap: { [key: string]: string } = {
    '1': 'IMPRESIONES',
    '2': 'SESIONES',
    '3': 'CONTRATOS',
  };

  constructor(
    private readonly productosService: ProductosService,
    private readonly carritoService: CarritoService
  ) {}

  ngOnInit() {
    this.categoriasUnicas = Object.entries(this.categoriasMap).map(
      ([id, nombre]) => ({ id, nombre })
    );
    this.cargarProductos();

    // Inicializar SignalR para el carrito
    this.inicializarCarrito();
  }

  private async inicializarCarrito(): Promise<void> {
    const clienteId = Number(localStorage.getItem('currentUserId'));
    if (clienteId) {
      // Inicializar SignalR
      await this.carritoService.inicializar();

      // Configurar eventos del carrito
      this.configurarEventosCarrito();

      // Cargar carrito actual
      this.cargarCarritoActual(clienteId);
    }
  }

  private configurarEventosCarrito(): void {
    // Suscribirse a actualizaciones del carrito actual
    this.carritoActualizadoSub =
      this.carritoService.carritoActualizado$.subscribe((carrito) => {
        if (carrito) {
          console.log(
            '[Productos] Carrito actualizado en tiempo real:',
            carrito
          );
          this.carritoActual = carrito;
          // Aquí puedes mostrar un mensaje de éxito o actualizar UI
          this.mostrarMensajeExito(
            'Producto agregado al carrito correctamente'
          );
        }
      });

    // Suscribirse al carrito actual (para estado inicial)
    this.carritoSub = this.carritoService.carritoActual$.subscribe(
      (carrito) => {
        this.carritoActual = carrito;
        console.log('[Productos] Carrito actual cargado:', carrito);
      }
    );
  }

  private cargarCarritoActual(clienteId: number): void {
    this.carritoService.getCarritoActual(clienteId).subscribe({
      next: (carrito) => {
        this.carritoActual = carrito;
        console.log('[Productos] Carrito actual cargado:', carrito);
      },
      error: (error) => {
        console.log(
          '[Productos] No hay carrito activo o error al cargar:',
          error
        );
        // Es normal que no haya carrito activo
      },
    });
  }

  cargarProductos() {
    this.cargando = true;

    this.productosService
      .getProductosPaginados(
        this.categoriaSeleccionada,
        this.terminoBusqueda,
        this.paginaActual,
        this.pageSize
      )
      .subscribe({
        next: (resp) => {
          this.productos = resp.productos;
          this.totalProductos = resp.total;
          this.cargando = false;

          if (this.categoriaSeleccionada === '') {
            this.obtenerCategoriasUnicas(resp.productos);
          }
        },
        error: (e) => {
          console.error(e);
          this.cargando = false;
        },
      });
  }

  obtenerCategoriasUnicas(productos: ProductosResponse[]) {
    const categoriasNumericas = [...new Set(productos.map((p) => p.categoria))];
    this.categoriasUnicas = categoriasNumericas.map((cat) => ({
      id: cat,
      nombre: this.categoriasMap[cat] || cat,
    }));
  }

  obtenerNombreCategoria(categoriaId: string): string {
    return this.categoriasMap[categoriaId] || categoriaId;
  }

  onCategoriaChange(ev: Event) {
    const select = ev.target as HTMLSelectElement;
    this.categoriaSeleccionada = select.value ?? '';
    this.paginaActual = 1;

    if (this.categoriaSeleccionada === '') {
      this.terminoBusqueda = '';
    }

    this.cargarProductos();
  }

  onBuscar() {
    this.paginaActual = 1;
    this.cargarProductos();
  }

  cambiarPagina(nuevaPagina: number) {
    if (nuevaPagina < 1 || nuevaPagina > this.totalPaginas) return;
    this.paginaActual = nuevaPagina;
    this.cargarProductos();
  }

  get totalPaginas(): number {
    return Math.ceil(this.totalProductos / this.pageSize);
  }

  comprarProducto(producto: ProductosResponse) {
    console.log('Comprando producto:', producto);
    alert(`¡Has comprado ${producto.nombre}!`);
  }

  agregarProductoAlCarrito(producto: ProductosResponse) {
    const clienteId = Number(localStorage.getItem('currentUserId'));
    console.log('[AgregarProducto] clienteId obtenido:', clienteId);

    if (!clienteId || clienteId === 0) {
      alert(
        'No se encontró el clienteId en localStorage. Por favor, inicia sesión nuevamente.'
      );
      return;
    }

    const crearCarrito: CrearCarrito = {
      clienteId: clienteId,
      estado: 'ACTIVO',
      fechaCreacion: new Date().toISOString(),
      total: 0,
    };

    this.carritoService
      .getCarritoActual(clienteId)
      .pipe(
        switchMap((carrito) => {
          console.log('[AgregarProducto] Carrito activo encontrado:', carrito);
          const agregarProducto: AgregarProductoCarrito = {
            carritoId: carrito.id,
            productoId: producto.id,
            cantidad: 1,
            precioUnitario: producto.precio,
          };
          console.log(
            '[AgregarProducto] Objeto para agregar producto:',
            agregarProducto
          );
          return this.carritoService.agregarProductoAlCarrito(
            agregarProducto,
            clienteId
          );
        }),
        catchError((error) => {
          console.error(
            '[AgregarProducto] Error al obtener carrito actual:',
            error
          );
          if (
            error.status === 400 &&
            error.error === 'Carrito no encontrado o no activo.'
          ) {
            console.log(
              '[AgregarProducto] No hay carrito activo, creando uno nuevo...'
            );
            return this.carritoService.crearCarrito(crearCarrito).pipe(
              switchMap((nuevoCarrito) => {
                console.log('[AgregarProducto] Carrito creado:', nuevoCarrito);
                const agregarProducto: AgregarProductoCarrito = {
                  carritoId: nuevoCarrito.id,
                  productoId: producto.id,
                  cantidad: 1,
                  precioUnitario: producto.precio,
                };
                console.log(
                  '[AgregarProducto] Objeto para agregar producto (nuevo carrito):',
                  agregarProducto
                );
                return this.carritoService.agregarProductoAlCarrito(
                  agregarProducto,
                  clienteId
                );
              })
            );
          }
          return throwError(() => error);
        })
      )
      .subscribe({
        next: (resp) => {
          console.log(
            '[AgregarProducto] Producto agregado correctamente:',
            resp
          );
          // El mensaje de éxito se mostrará automáticamente cuando llegue el evento del socket
        },
        error: (e) => {
          console.error(
            '[AgregarProducto] Error final al agregar producto:',
            e
          );
          this.mostrarMensajeError('Error al agregar producto al carrito');
        },
      });
  }

  private mostrarMensajeExito(mensaje: string): void {
    // Aquí puedes implementar tu lógica para mostrar mensajes de éxito
    // Por ejemplo, usando un toast, alert, o una notificación
    console.log('✅ ' + mensaje);
    // alert(mensaje); // O usar un servicio de notificaciones
  }

  private mostrarMensajeError(mensaje: string): void {
    // Aquí puedes implementar tu lógica para mostrar mensajes de error
    console.error('❌ ' + mensaje);
    // alert(mensaje); // O usar un servicio de notificaciones
  }

  ngOnDestroy(): void {
    if (this.carritoSub) {
      this.carritoSub.unsubscribe();
    }
    if (this.carritoActualizadoSub) {
      this.carritoActualizadoSub.unsubscribe();
    }
  }

  // Método para verificar el estado de la conexión (opcional)
  get connectionState(): string {
    return this.carritoService.connectionState;
  }
}
