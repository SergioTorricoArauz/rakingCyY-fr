import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      return true; // Usuario autenticado, permite acceso
    } else {
      // Redirigir a login y guardar la URL original
      this.router.navigate(['/login']);
      return false; // Bloquea acceso
    }
  }
}
