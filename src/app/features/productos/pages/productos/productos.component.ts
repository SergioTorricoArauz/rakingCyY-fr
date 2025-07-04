import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductosService } from '../../services/productos.service';
import { ProductosResponse } from '../../models/productos';
import {
  AgregarProductoCarrito,
  CrearCarrito,
} from '../../../carritos/models/historial-carrito';
import { CarritoService } from '../../../carritos/services/carrito.service';
import { Subscription } from 'rxjs';

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

    this.inicializarCarrito();
  }

  private async inicializarCarrito(): Promise<void> {
    const clienteId = Number(localStorage.getItem('currentUserId'));
    if (clienteId) {
      await this.carritoService.inicializar();

      this.configurarEventosCarrito();

      this.cargarCarritoActual(clienteId);
    }
  }

  private configurarEventosCarrito(): void {
    this.carritoActualizadoSub =
      this.carritoService.carritoActualizado$.subscribe((carrito) => {
        if (carrito) {
          console.log(
            '[Productos] Carrito actualizado en tiempo real:',
            carrito
          );
          this.carritoActual = carrito;
          this.mostrarMensajeExito(
            'Producto agregado al carrito correctamente'
          );
        }
      });

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

    this.carritoService.getCarritoActual(clienteId).subscribe({
      next: (carrito) => {
        console.log('[AgregarProducto] Carrito activo encontrado:', carrito);
        this.agregarProductoAlCarritoExistente(producto, carrito.id, clienteId);
      },
      error: (error) => {
        console.log(
          '[AgregarProducto] No hay carrito activo, creando uno nuevo...'
        );
        this.crearCarritoYAgregarProducto(producto, clienteId);
      },
    });
  }

  private crearCarritoYAgregarProducto(
    producto: ProductosResponse,
    clienteId: number
  ): void {
    const nuevoCarrito: CrearCarrito = {
      clienteId: clienteId,
      estado: 'Activo',
      fechaCreacion: new Date().toISOString(),
      total: 0,
    };

    this.carritoService.crearCarrito(nuevoCarrito).subscribe({
      next: (response) => {
        console.log('[AgregarProducto] Carrito creado exitosamente:', response);
        this.agregarProductoAlCarritoExistente(
          producto,
          response.id,
          clienteId
        );
      },
      error: (error) => {
        console.error('[AgregarProducto] Error al crear carrito:', error);
        this.mostrarMensajeError('Error al crear carrito');
      },
    });
  }

  private agregarProductoAlCarritoExistente(
    producto: ProductosResponse,
    carritoId: number,
    clienteId: number
  ): void {
    const agregarProducto: AgregarProductoCarrito = {
      carritoId: carritoId,
      productoId: producto.id,
      cantidad: 1,
      precioUnitario: producto.precio,
    };

    console.log(
      '[AgregarProducto] Agregando producto al carrito:',
      agregarProducto
    );

    this.carritoService
      .agregarProductoAlCarrito(agregarProducto, clienteId)
      .subscribe({
        next: (resp) => {
          console.log(
            '[AgregarProducto] Producto agregado correctamente:',
            resp
          );
        },
        error: (e) => {
          console.error('[AgregarProducto] Error al agregar producto:', e);
          this.mostrarMensajeError('Error al agregar producto al carrito');
        },
      });
  }

  private mostrarMensajeExito(mensaje: string): void {
    console.log('✅ ' + mensaje);
  }

  private mostrarMensajeError(mensaje: string): void {
    console.error(mensaje);
  }

  ngOnDestroy(): void {
    if (this.carritoSub) {
      this.carritoSub.unsubscribe();
    }
    if (this.carritoActualizadoSub) {
      this.carritoActualizadoSub.unsubscribe();
    }
  }
  get connectionState(): string {
    return this.carritoService.connectionState;
  }
}
