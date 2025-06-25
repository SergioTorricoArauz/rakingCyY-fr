import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'login',
    loadChildren: () =>
      import('./features/login/routes/login.routes').then(
        (m) => m.LOGIN_ROUTES
      ),
  },

  {
    path: 'temporadas',
    loadChildren: () =>
      import('./features/temporadas/routes/temporadas.routes').then(
        (m) => m.TEMPORADAS_ROUTES
      ),
  },

  {
    path: 'insignias',
    loadChildren: () =>
      import('./features/insignias/routes/insignias.routes').then(
        (m) => m.INSIGNIAS_ROUTES
      ),
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
  },

  {
    path: 'productos',
    loadChildren: () =>
      import('./features/productos/routes/productos.routes').then(
        (m) => m.PRODUCTOS_ROUTES
      ),
  },
];
