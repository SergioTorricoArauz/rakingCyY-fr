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
  productosFiltrados: ProductosResponse[] = [];
  categoriasUnicas: { id: string; nombre: string }[] = [];
  terminoBusqueda: string = '';
  categoriaSeleccionada: string = '';
  cargando: boolean = true;

  // Mapeo de categorías
  categoriasMap: { [key: string]: string } = {
    '1': 'IMPRESIONES',
    '2': 'SESIONES',
    '3': 'CONTRATOS',
  };

  constructor(private readonly productosService: ProductosService) {}

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.cargando = true;
    this.productosService.getProductos().subscribe({
      next: (productos) => {
        this.productos = productos;
        this.productosFiltrados = productos;
        this.obtenerCategoriasUnicas();
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
        this.cargando = false;
      },
    });
  }

  obtenerCategoriasUnicas() {
    // Obtener categorías únicas y mapearlas a nombres
    const categoriasNumericas = [
      ...new Set(this.productos.map((p) => p.categoria)),
    ];
    this.categoriasUnicas = categoriasNumericas.map((cat) => ({
      id: cat,
      nombre: this.categoriasMap[cat] || cat,
    }));
  }

  obtenerNombreCategoria(categoriaId: string): string {
    return this.categoriasMap[categoriaId] || categoriaId;
  }

  filtrarPorCategoria(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.categoriaSeleccionada = select.value;

    if (this.categoriaSeleccionada) {
      // Usar el servicio para obtener productos por categoría (enviando el ID)
      this.cargando = true;
      this.productosService
        .getProductosByCategoria(this.categoriaSeleccionada)
        .subscribe({
          next: (productos) => {
            this.productosFiltrados = productos;
            this.cargando = false;
          },
          error: (error) => {
            console.error('Error al cargar productos por categoría:', error);
            this.cargando = false;
          },
        });
    } else {
      // Si no hay categoría seleccionada, mostrar todos los productos
      this.productosFiltrados = this.productos;
    }

    // Aplicar filtro de búsqueda si hay término de búsqueda
    if (this.terminoBusqueda) {
      this.aplicarFiltroBusqueda();
    }
  }

  filtrarProductos() {
    this.aplicarFiltroBusqueda();
  }

  aplicarFiltroBusqueda() {
    if (!this.terminoBusqueda) {
      // Si no hay término de búsqueda, restaurar el filtro de categoría
      if (this.categoriaSeleccionada) {
        this.cargando = true;
        this.productosService
          .getProductosByCategoria(this.categoriaSeleccionada)
          .subscribe({
            next: (productos) => {
              this.productosFiltrados = productos;
              this.cargando = false;
            },
            error: (error) => {
              console.error('Error al cargar productos por categoría:', error);
              this.cargando = false;
            },
          });
      } else {
        this.productosFiltrados = this.productos;
      }
      return;
    }

    // Filtrar por término de búsqueda en los productos actuales
    const productosABuscar = this.categoriaSeleccionada
      ? this.productosFiltrados
      : this.productos;
    this.productosFiltrados = productosABuscar.filter((producto) => {
      return (
        producto.nombre
          .toLowerCase()
          .includes(this.terminoBusqueda.toLowerCase()) ||
        producto.descripcion
          .toLowerCase()
          .includes(this.terminoBusqueda.toLowerCase())
      );
    });
  }

  comprarProducto(producto: ProductosResponse) {
    // Aquí puedes implementar la lógica de compra
    console.log('Comprando producto:', producto);
    alert(`¡Has comprado ${producto.nombre}!`);
  }
}
