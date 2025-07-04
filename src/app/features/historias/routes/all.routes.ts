import { Routes } from '@angular/router';
import { AdminGuard } from '../../../core/guards/admin.guard';
import { HistoriasAllComponent } from '../pages/historias-all/historias-all.component';

export const CREAR_ROUTES: Routes = [
  {
    path: '',
    component: HistoriasAllComponent,
    canActivate: [AdminGuard],
  },
];
