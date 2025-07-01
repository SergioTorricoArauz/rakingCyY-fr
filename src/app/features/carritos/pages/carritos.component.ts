import { Component } from '@angular/core';
import { CarritoService } from '../services/carrito.service';
import { HistorialCarrito } from '../models/historial-carrito';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carritos',
  imports: [CommonModule],
  templateUrl: './carritos.component.html',
  styleUrl: './carritos.component.css',
})
export class CarritosComponent {
  historial: HistorialCarrito[] = [];
  seleccionado: HistorialCarrito | null = null;

  constructor(private readonly carritoService: CarritoService) {}

  ngOnInit(): void {
    const userId = Number(localStorage.getItem('currentUserId'));
    if (userId) {
      this.carritoService.getHistorialCarrito(userId).subscribe((data) => {
        this.historial = data;
      });
    }
  }

  seleccionarCarrito(carrito: HistorialCarrito): void {
    this.seleccionado = carrito;
  }
}
