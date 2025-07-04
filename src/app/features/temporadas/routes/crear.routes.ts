import { Routes } from '@angular/router';
import { AdminGuard } from '../../../core/guards/admin.guard';
import { CrearTemporadaComponent } from '../pages/crear-temporada/crear-temporada.component';

export const CREAR_ROUTES: Routes = [
  {
    path: '',
    component: CrearTemporadaComponent,
    canActivate: [AdminGuard],
  },
];
