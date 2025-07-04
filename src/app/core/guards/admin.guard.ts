import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  canActivate(): boolean {
    // Verificar si el usuario está autenticado
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }

    // Verificar si el usuario es Admin
    const currentUserNombre = this.authService.getCurrentUserNombre();

    if (currentUserNombre === 'Admin') {
      return true; // Permite acceso solo a Admin
    } else {
      // Redirigir a una página de acceso denegado o a la página principal
      this.router.navigate(['/productos']);
      return false; // Bloquea acceso
    }
  }
}
