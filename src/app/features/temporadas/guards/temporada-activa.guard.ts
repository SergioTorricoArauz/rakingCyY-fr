import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { TemporadasService } from '../services/temporadas.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { TemporadaUtils } from '../models/temporada';

@Injectable({
  providedIn: 'root',
})
export class TemporadaActivaGuard implements CanActivate {
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
        // Usar la utilidad para verificar si se puede ver el ranking
        if (temporada && TemporadaUtils.puedeVerRanking(temporada.estado)) {
          return true; // Permite acceso a temporadas visibles
        } else {
          this.router.navigate(['/temporadas']);
          return false; // Bloquea acceso a estados no visibles
        }
      }),
      catchError(() => {
        this.router.navigate(['/temporadas']);
        return of(false);
      })
    );
  }
}
