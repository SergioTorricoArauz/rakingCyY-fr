import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductosService } from '../../services/productos.service';
import { ProductoPost } from '../../models/productos';

@Component({
  selector: 'app-crear-producto',
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-producto.component.html',
  styleUrl: './crear-producto.component.css',
})
export class CrearProductoComponent implements OnInit {
  producto: ProductoPost = {
    nombre: '',
    descripcion: '',
    precio: 0,
    cantidadMaximaClientes: 100,
    categoria: 1,
    cantidadComprada: 0,
    estaDisponible: true,
    fechaCreacion: new Date().toISOString(),
  };

  cargando = false;
  mensaje = '';
  tipoMensaje: 'success' | 'error' = 'success';

  categorias = [
    { id: 1, nombre: 'IMPRESIONES' },
    { id: 2, nombre: 'SESIONES' },
    { id: 3, nombre: 'CONTRATOS' },
  ];

  constructor(
    private readonly productosService: ProductosService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    // Inicializar el formulario
  }

  crearProducto(): void {
    if (!this.validarFormulario()) {
      return;
    }

    this.cargando = true;
    this.mensaje = '';

    console.log('Creando producto:', this.producto);

    this.productosService.createProducto(this.producto).subscribe({
      next: (response) => {
        console.log('Producto creado exitosamente:', response);
        this.mostrarMensaje('Producto creado exitosamente', 'success');
        this.cargando = false;

        this.limpiarFormulario();

        setTimeout(() => {
          this.router.navigate(['/productos']);
        }, 2000);
      },
      error: (error) => {
        console.error('Error al crear producto:', error);
        this.mostrarMensaje(
          'Error al crear el producto. Inténtalo de nuevo.',
          'error'
        );
        this.cargando = false;
      },
    });
  }

  private validarFormulario(): boolean {
    if (!this.producto.nombre || this.producto.nombre.trim() === '') {
      this.mostrarMensaje('El nombre del producto es obligatorio', 'error');
      return false;
    }

    if (!this.producto.descripcion || this.producto.descripcion.trim() === '') {
      this.mostrarMensaje(
        'La descripción del producto es obligatoria',
        'error'
      );
      return false;
    }

    if (this.producto.precio <= 0) {
      this.mostrarMensaje('El precio debe ser mayor a 0', 'error');
      return false;
    }

    if (!this.producto.categoria) {
      this.mostrarMensaje('Debe seleccionar una categoría', 'error');
      return false;
    }

    return true;
  }

  private mostrarMensaje(mensaje: string, tipo: 'success' | 'error'): void {
    this.mensaje = mensaje;
    this.tipoMensaje = tipo;

    setTimeout(() => {
      this.mensaje = '';
    }, 5000);
  }

  private limpiarFormulario(): void {
    this.producto = {
      nombre: '',
      descripcion: '',
      precio: 0,
      categoria: 1,
      cantidadMaximaClientes: 100,
      cantidadComprada: 0,
      estaDisponible: true,
      fechaCreacion: new Date().toISOString(),
    };
  }

  cancelar(): void {
    this.router.navigate(['/productos']);
  }
}
