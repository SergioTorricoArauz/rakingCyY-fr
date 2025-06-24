// src/app/shared/navbar/navbar.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

interface Notification {
  id: number;
  title: string;
  message: string;
  time: Date;
  read: boolean;
  type: 'cart' | 'temporada' | 'general';
  icon: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  usuarioNombre: string | null = null;
  cartItemCount: number = 0;
  notificationCount: number = 0;
  showNotifications: boolean = false;
  notifications: Notification[] = [];

  constructor(
    public authService: AuthService,
    private readonly router: Router
  ) {}

  ngOnInit() {
    this.usuarioNombre = this.authService.getCurrentUserNombre();
    this.loadCartItems();
    this.loadNotifications();

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.usuarioNombre = this.authService.getCurrentUserNombre();
      }
    });
  }

  onLogout(): void {
    this.authService.logout();
  }

  toggleNotifications(event: Event): void {
    event.preventDefault();
    this.showNotifications = !this.showNotifications;
  }

  private loadCartItems(): void {
    // Aquí cargarías los items del carrito desde un servicio
    this.cartItemCount = 3; // Ejemplo: 3 items en el carrito
  }

  private loadNotifications(): void {
    // Simulamos notificaciones con iconos específicos
    this.notifications = [
      {
        id: 1,
        title: 'Producto agregado al carrito',
        message: 'Camiseta deportiva "Raking CyY" agregada exitosamente',
        time: new Date(),
        read: false,
        type: 'cart',
        icon: 'fas fa-shopping-cart',
      },
      {
        id: 2,
        title: 'Oferta especial en carrito',
        message: '¡20% de descuento en tu próxima compra!',
        time: new Date(Date.now() - 1800000), // 30 minutos atrás
        read: false,
        type: 'cart',
        icon: 'fas fa-tags',
      },
      {
        id: 3,
        title: 'Nueva temporada disponible',
        message: 'La temporada de verano ya está activa',
        time: new Date(Date.now() - 3600000), // 1 hora atrás
        read: false,
        type: 'temporada',
        icon: 'fas fa-trophy',
      },
      {
        id: 4,
        title: 'Producto en oferta',
        message: '30% de descuento en equipos deportivos',
        time: new Date(Date.now() - 7200000), // 2 horas atrás
        read: true,
        type: 'general',
        icon: 'fas fa-gift',
      },
    ];
    this.notificationCount = this.notifications.filter((n) => !n.read).length;
  }

  // Método para obtener la clase CSS según el tipo de notificación
  getNotificationClass(type: string): string {
    switch (type) {
      case 'cart':
        return 'notification-cart';
      case 'temporada':
        return 'notification-temporada';
      case 'general':
        return 'notification-general';
      default:
        return 'notification-general';
    }
  }
}
