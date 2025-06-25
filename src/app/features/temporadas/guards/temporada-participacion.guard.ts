import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { TemporadasService } from '../services/temporadas.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TemporadaParticipacionGuard implements CanActivate {
  constructor(
    private readonly temporadasService: TemporadasService,
    private readonly router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const temporadaId = route.paramMap.get('id');

    if (!temporadaId) {
      this.router.navigate(['/temporadas']);
      return of(false);
    }

    return this.temporadasService.getTemporadaById(Number(temporadaId)).pipe(
      map((temporada) => {
        // Solo permitir participación en temporadas activas
        if (temporada.estado === 'Activa') {
          return true; // Permite unirse solo a temporadas activas
        } else if (temporada.estado === 'Pendiente') {
          // Para temporadas pendientes, mostrar mensaje pero permitir ver
          return true;
        } else if (temporada.estado === 'Inactiva') {
          // Para temporadas finalizadas, permitir ver pero no participar
          return true;
        } else {
          this.router.navigate(['/temporadas']);
          return false;
        }
      }),
      catchError(() => {
        this.router.navigate(['/temporadas']);
        return of(false);
      })
    );
  }
}
