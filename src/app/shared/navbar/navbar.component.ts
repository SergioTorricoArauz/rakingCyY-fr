// src/app/shared/navbar/navbar.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CarritoService } from '../../features/carritos/services/carrito.service';
import { Articulo } from '../../features/carritos/models/historial-carrito';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  usuarioNombre: string | null = null;
  showCarritoDropdown = false;
  carritoArticulos: Articulo[] = [];

  constructor(
    public authService: AuthService,
    private readonly carritoService: CarritoService,
    private readonly router: Router
  ) {}

  ngOnInit() {
    this.usuarioNombre = this.authService.getCurrentUserNombre();
    this.loadCarritoArticulos();

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.usuarioNombre = this.authService.getCurrentUserNombre();
      }
    });
  }

  private loadCarritoArticulos(): void {
    const clienteId = this.authService.getCurrentUser()?.id;
    if (typeof clienteId !== 'number') return;

    this.carritoService.getCarritoActual(clienteId).subscribe({
      next: (cart) => {
        this.carritoArticulos = cart.articulos || [];
      },
      error: (err) => console.error('Error al cargar carrito:', err),
    });
  }

  toggleCarritoDropdown(event: Event): void {
    event.preventDefault();
    this.showCarritoDropdown = !this.showCarritoDropdown;
  }

  onLogout(): void {
    this.authService.logout();
  }
}
