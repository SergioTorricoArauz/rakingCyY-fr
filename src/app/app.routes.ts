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
    path: 'register',
    loadChildren: () =>
      import('./features/clientes/routes/clientes.routes').then(
        (m) => m.CLIENTES_ROUTE
      ),
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
    path: 'crear-temporada',
    loadChildren: () =>
      import('./features/temporadas/routes/crear.routes').then(
        (m) => m.CREAR_ROUTES
      ),
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

  {
    path: 'crear-producto',
    loadChildren: () =>
      import('./features/productos/routes/crear.routes').then(
        (m) => m.CREAR_ROUTES
      ),
  },

  {
    path: 'carritos',
    loadChildren: () =>
      import('./features/carritos/routes/carrito.routes').then(
        (m) => m.CARRITOS_ROUTES
      ),
  },

  {
    path: 'pagos',
    loadChildren: () =>
      import('./features/carritos/routes/pagos.routes').then(
        (m) => m.PAGOS_ROUTES
      ),
  },

  {
    path: 'historias',
    loadChildren: () =>
      import('./features/historias/routes/historia.routes').then(
        (m) => m.HISTORIA_ROUTES
      ),
  },

  {
    path: 'crear-historia',
    loadChildren: () =>
      import('./features/historias/routes/crear.routes').then(
        (m) => m.CREAR_ROUTES
      ),
  },
];
