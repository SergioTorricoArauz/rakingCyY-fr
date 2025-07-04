import { Routes } from '@angular/router';
import { AdminGuard } from '../../../core/guards/admin.guard';
import { CrearHistoriasComponent } from '../pages/crear-historias/crear-historias.component';

export const CREAR_ROUTES: Routes = [
  {
    path: '',
    component: CrearHistoriasComponent,
    canActivate: [AdminGuard],
  },
];
