export interface Articulo {
  id: number;
  productoId: number;
  nombreProducto: string;
  cantidad: number;
  precioUnitario: number;
  subTotal: number;
}

export interface HistorialCarrito {
  id: number;
  clienteId: number;
  estado: string;
  fechaCreacion: string;
  total: number;
  articulos: Articulo[];
}

export interface CrearCarrito {
  clienteId: number;
  estado: string;
  fechaCreacion: string;
  total: number;
}
