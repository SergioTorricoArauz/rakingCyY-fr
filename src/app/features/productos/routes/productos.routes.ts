import { Routes } from '@angular/router';
import { ProductosComponent } from '../pages/productos/productos.component';

export const PRODUCTOS_ROUTES: Routes = [
  { path: '', component: ProductosComponent },
  // { path: 'carrito', component: CarritoComponent },
  // { path: 'detalle/:id', component: DetalleProductoComponent }
];
