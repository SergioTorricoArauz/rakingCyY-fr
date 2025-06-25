import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class LoginGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      // Si ya está logueado, redirigir a temporadas
      this.router.navigate(['/temporadas']);
      return false; // Bloquea acceso al login
    } else {
      return true; // Permite acceso al login
    }
  }
}
