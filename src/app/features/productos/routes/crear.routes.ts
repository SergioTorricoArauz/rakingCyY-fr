import { Routes } from '@angular/router';
import { CrearProductoComponent } from '../pages/crear-producto/crear-producto.component';
import { AdminGuard } from '../../../core/guards/admin.guard';

export const CREAR_ROUTES: Routes = [
  {
    path: '',
    component: CrearProductoComponent,
    canActivate: [AdminGuard],
  },
];
