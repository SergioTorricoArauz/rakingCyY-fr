import { Routes } from '@angular/router';
import { TemporadasComponent } from '../pages/temporadas/temporadas.component';
import { RakingTemporadaComponent } from '../pages/raking-temporada/raking-temporada.component';

export const TEMPORADAS_ROUTES: Routes = [
  { path: '', component: TemporadasComponent },
  { path: 'ranking/:id', component: RakingTemporadaComponent },
];
