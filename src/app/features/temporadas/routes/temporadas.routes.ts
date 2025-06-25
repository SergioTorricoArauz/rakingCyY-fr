import { Routes } from '@angular/router';
import { TemporadasComponent } from '../pages/temporadas/temporadas.component';
import { RakingTemporadaComponent } from '../pages/raking-temporada/raking-temporada.component';
import { TemporadaActivaGuard } from '../guards/temporada-activa.guard';

export const TEMPORADAS_ROUTES: Routes = [
  { path: '', component: TemporadasComponent },
  {
    path: 'ranking/:id',
    component: RakingTemporadaComponent,
    canActivate: [TemporadaActivaGuard], // Solo temporadas válidas
  },
];
