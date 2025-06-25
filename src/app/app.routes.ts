import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { LoginGuard } from './core/guards/login.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'login',
    loadChildren: () =>
      import('./features/login/routes/login.routes').then(
        (m) => m.LOGIN_ROUTES
      ),
    canActivate: [LoginGuard],
  },

  {
    path: 'temporadas',
    loadChildren: () =>
      import('./features/temporadas/routes/temporadas.routes').then(
        (m) => m.TEMPORADAS_ROUTES
      ),
    canActivate: [AuthGuard],
  },

  {
    path: 'insignias',
    loadChildren: () =>
      import('./features/insignias/routes/insignias.routes').then(
        (m) => m.INSIGNIAS_ROUTES
      ),
    canActivate: [AuthGuard],
  },

  {
    path: 'perfil',
    redirectTo: 'insignias/perfil',
    pathMatch: 'full',
  },

  {
    path: 'actividades',
    loadChildren: () =>
      import('./features/actividades/routes/actividades.routes').then(
        (m) => m.ACTIVIDADES_ROUTES
      ),
    canActivate: [AuthGuard],
  },

  {
    path: 'productos',
    loadChildren: () =>
      import('./features/productos/routes/productos.routes').then(
        (m) => m.PRODUCTOS_ROUTES
      ),
    canActivate: [AuthGuard],
  },
];
