// src/app/core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../enviroments/enviroment';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Login } from '../../features/login/models/login';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/api/Auth/login`;

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router
  ) {}

  // auth.service.ts
  login(credentials: Login): Observable<any> {
    return this.http.post(this.apiUrl, credentials).pipe(
      tap((response: any) => {
        localStorage.setItem('currentUserId', response.id);
        localStorage.setItem('currentUserNombre', response.nombre);
      })
    );
  }

  logout(): void {
    // Hacemos POST al endpoint de logout y pedimos responseType: 'text'
    this.http
      .post(
        `${this.apiUrl}/logout`,
        {}, // No enviamos body adicional
        { responseType: 'text' } // <-- IMPORTANTE: esperamos texto
      )
      .pipe(
        tap({
          next: (respuestaTexto: string) => {
            console.log('Respuesta de logout:', respuestaTexto);
            localStorage.removeItem('currentUserId');
            localStorage.removeItem('currentUserNombre');

            this.router.navigate(['/login']);
          },
          error: (err) => {
            console.error('Error al invocar /logout:', err);
            localStorage.removeItem('currentUserId');
            localStorage.removeItem('currentUserNombre');
            this.router.navigate(['/login']);
          },
        })
      )
      .subscribe();
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('currentUserId');
  }

  getCurrentUser(): { id: number; nombre: string } | null {
    const id = localStorage.getItem('currentUserId');
    const nombre = localStorage.getItem('currentUserNombre');
    if (id && nombre) {
      return { id: +id, nombre };
    }
    return null;
  }

  getCurrentUserNombre(): string | null {
    return localStorage.getItem('currentUserNombre');
  }

  isAdmin(): boolean {
    return this.getCurrentUserNombre() === 'Admin';
  }
}
