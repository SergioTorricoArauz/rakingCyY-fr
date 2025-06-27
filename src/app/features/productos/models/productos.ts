export interface ProductosResponse {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  cantidad_maxima_clientes: number;
  cantidad_comprada: number;
  esta_disponible: boolean;
  categoria: string;
  fecha_creacion: string;
}

export interface ProductoPost {
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
}
