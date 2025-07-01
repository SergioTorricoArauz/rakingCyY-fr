import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductosService } from '../../services/productos.service';
import { ProductosResponse } from '../../models/productos';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css',
})
export class ProductosComponent implements OnInit {
  productos: ProductosResponse[] = [];
  categoriasUnicas: { id: string; nombre: string }[] = [];
  terminoBusqueda: string = '';
  categoriaSeleccionada: string = '';
  cargando: boolean = true;
  totalProductos: number = 0;
  paginaActual: number = 1;
  pageSize: number = 20;

  categoriasMap: { [key: string]: string } = {
    '1': 'IMPRESIONES',
    '2': 'SESIONES',
    '3': 'CONTRATOS',
  };

  constructor(private readonly productosService: ProductosService) {}

  ngOnInit() {
    this.categoriasUnicas = Object.entries(this.categoriasMap).map(
      ([id, nombre]) => ({ id, nombre })
    );
    this.cargarProductos();
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
}
