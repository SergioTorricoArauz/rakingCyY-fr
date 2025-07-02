export interface ImagenHistoria {
  id: number;
  nombreArchivo: string;
  url: string;
  orden: number;
}

export interface ComentarioHistoria {
  id: number;
  clienteId: number;
  nombreCliente: string;
  comentario: string;
  fechaComentario: string;
  likes: number;
  yaLeDiLike: boolean;
  _likeLoading?: boolean;
}

export interface HistoriaActiva {
  id: number;
  clienteId: number;
  nombreCliente: string;
  descripcion: string;
  fechaCreacion: string;
  fechaExpiracion: string;
  estaActiva: boolean;
  permiteComentarios: boolean;
  puedeComentarAun: boolean;
  imagenes: ImagenHistoria[];
  comentarios: ComentarioHistoria[];
}

export interface LikeComentarioResponse {
  success: boolean;
  comentario: ComentarioHistoria;
}
