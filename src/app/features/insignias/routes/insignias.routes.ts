import { Routes } from '@angular/router';
import { InsigniasComponent } from '../pages/insignias/insignias.component';
import { InsigniasPorClienteComponent } from '../pages/insignias-por-cliente/insignias-por-cliente.component';
import { PerfilGuard } from '../guards/perfil.guard';

export const INSIGNIAS_ROUTES: Routes = [
  { path: '', component: InsigniasComponent },
  {
    path: 'perfil',
    component: InsigniasPorClienteComponent,
    canActivate: [PerfilGuard], // Verificar perfil válido
  },
];
