import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarritoService } from '../../services/carrito.service';
import { HistorialCarrito } from '../../models/historial-carrito';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-pagos',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './pagos.component.html',
  styleUrl: './pagos.component.css',
})
export class PagosComponent implements OnInit {
  carrito: HistorialCarrito | null = null;
  mostrarFormularioFactura = false;
  cargando = true;
  datosFactura = {
    nombre: '',
    email: '',
    tarjeta: '',
  };

  // Propiedades para validación en tiempo real
  validaciones = {
    nombre: false,
    email: false,
    tarjeta: false,
  };

  constructor(private readonly carritoService: CarritoService) {}

  ngOnInit(): void {
    const clienteId = Number(localStorage.getItem('currentUserId'));
    if (clienteId) {
      this.cargarCarritoActual(clienteId);
    }
  }

  private cargarCarritoActual(clienteId: number): void {
    this.carritoService.getCarritoActual(clienteId).subscribe({
      next: (carrito) => {
        this.carrito = carrito;
        this.cargando = false;
        console.log('Carrito cargado:', carrito);
      },
      error: (error) => {
        console.error('Error al cargar carrito:', error);
        this.cargando = false;
      },
    });
  }

  pagar(): void {
    if (!this.carrito || this.carrito.articulos.length === 0) {
      alert('No hay productos en el carrito');
      return;
    }
    this.mostrarFormularioFactura = true;
  }

  finalizarCompra(): void {
    if (!this.carrito) {
      alert('No hay carrito para finalizar');
      return;
    }

    // Validar campos obligatorios
    if (
      !this.datosFactura.nombre ||
      !this.datosFactura.email ||
      !this.datosFactura.tarjeta
    ) {
      alert('Por favor complete todos los campos obligatorios');
      return;
    }

    // Usar el servicio para finalizar la compra
    this.carritoService.finalizarCompra(this.carrito.id).subscribe({
      next: (mensaje) => {
        console.log('Compra finalizada exitosamente:', mensaje);
        alert('¡Compra realizada con éxito!');

        // Limpiar formulario y validaciones
        this.datosFactura = {
          nombre: '',
          email: '',
          tarjeta: '',
        };

        this.validaciones = {
          nombre: false,
          email: false,
          tarjeta: false,
        };

        // Ocultar formulario
        this.mostrarFormularioFactura = false;

        // Actualizar la página
        window.location.reload();
      },
      error: (error) => {
        console.error('Error al finalizar compra:', error);

        let mensajeError = 'Error al finalizar la compra.';
        if (error.status === 404) {
          mensajeError = 'Carrito no encontrado.';
        } else if (error.status === 400) {
          mensajeError = 'Datos de carrito inválidos.';
        } else if (error.status === 500) {
          mensajeError = 'Error del servidor. Inténtalo más tarde.';
        }

        alert(mensajeError);
      },
    });
  }

  cancelarPago(): void {
    this.mostrarFormularioFactura = false;
    this.datosFactura = {
      nombre: '',
      email: '',
      tarjeta: '',
    };
  }

  calcularSubtotal(): number {
    if (!this.carrito) return 0;
    return this.carrito.articulos.reduce(
      (total, articulo) => total + articulo.subTotal,
      0
    );
  }

  // Métodos para validación en tiempo real
  validarNombre(): void {
    this.validaciones.nombre = this.datosFactura.nombre.trim().length >= 3;
    console.log('Nombre válido:', this.validaciones.nombre);
  }

  validarEmail(): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.validaciones.email = emailRegex.test(this.datosFactura.email);
    console.log('Email válido:', this.validaciones.email);
  }

  validarTarjeta(): void {
    // Validar que tenga 16 dígitos (sin espacios)
    const tarjetaLimpia = this.datosFactura.tarjeta.replace(/\s/g, '');
    this.validaciones.tarjeta = /^\d{16}$/.test(tarjetaLimpia);
    console.log('Tarjeta válida:', this.validaciones.tarjeta);
  }

  // Método para verificar si todos los campos son válidos
  get formularioValido(): boolean {
    console.log('Validaciones:', this.validaciones);
    return (
      this.validaciones.nombre &&
      this.validaciones.email &&
      this.validaciones.tarjeta
    );
  }
}
