export interface ProductosResponse {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  cantidad_maxima_clientes: number;
  cantidad_comprada: number;
  esta_disponible: boolean;
  categoria: string;
}

export interface ProductoResponse {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  cantidadMaximaClientes: number;
  cantidadComprada: number;
  estaDisponible: boolean;
  categoria: number;
}

export interface ProductoPost {
  nombre: string;
  descripcion: string;
  precio: number;
  cantidadMaximaClientes: number;
  cantidadComprada: number;
  estaDisponible: boolean;
  fechaCreacion: string;
  categoria: number;
}
