import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/pages/login/login.component';
import { TemporadasComponent } from './features/temporadas/pages/temporadas/temporadas.component';
import { InsigniasPorClienteComponent } from './features/insignias/pages/insignias-por-cliente/insignias-por-cliente.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'temporadas', component: TemporadasComponent},
    { path: 'perfil', component: InsigniasPorClienteComponent },
];
