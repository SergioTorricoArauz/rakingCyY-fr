import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class PerfilGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  canActivate(): boolean {
    const userId = localStorage.getItem('currentUserId');

    if (userId && this.authService.isAuthenticated()) {
      return true; // Usuario válido, permite acceso al perfil
    } else {
      this.router.navigate(['/login']);
      return false; // Bloquea acceso
    }
  }
}
