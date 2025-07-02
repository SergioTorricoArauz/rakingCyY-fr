import { Component, OnInit } from '@angular/core';
import {
  HistoriaActiva,
  ComentarioHistoria,
  CrearComentarioRequest,
} from '../../models/historia';
import { HistoriasService } from '../../services/historias.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type HistoriaActivaExt = HistoriaActiva & {
  nuevoComentario?: string;
  comentarioEnviando?: boolean;
};

@Component({
  selector: 'app-historias',
  templateUrl: './historias.component.html',
  styleUrls: ['./historias.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class HistoriasComponent implements OnInit {
  historias: HistoriaActivaExt[] = [];
  loading = true;
  clienteActualId = 6; // <-- aquí pon el id del usuario en sesión

  constructor(private readonly historiaService: HistoriasService) {}

  ngOnInit(): void {
    this.historiaService.getHistoriasActivas().subscribe({
      next: (data) => {
        this.historias = data.map((historia) => ({
          ...historia,
          nuevoComentario: '',
          comentarioEnviando: false,
        }));
        this.loading = false;
        this.actualizarLikesComentarios();
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  actualizarLikesComentarios(): void {
    this.historias.forEach((historia) => {
      historia.comentarios.forEach((comentario, idx) => {
        this.historiaService
          .getComentario(comentario.id, this.clienteActualId)
          .subscribe((comentarioActualizado: ComentarioHistoria) => {
            comentario.yaLeDiLike = comentarioActualizado.yaLeDiLike;
          });
      });
    });
  }

  toggleLike(comentario: ComentarioHistoria): void {
    if (comentario._likeLoading) return;
    comentario._likeLoading = true;

    this.historiaService
      .likeComentario(comentario.id, this.clienteActualId)
      .subscribe({
        next: (resp) => {
          comentario.likes = resp.comentario.likes;
          comentario.yaLeDiLike = resp.comentario.yaLeDiLike;
          comentario._likeLoading = false;
        },
        error: () => {
          comentario._likeLoading = false;
        },
      });
  }

  enviarComentario(historia: any): void {
    if (!historia.nuevoComentario || historia.comentarioEnviando) return;

    historia.comentarioEnviando = true;
    const request: CrearComentarioRequest = {
      historiaId: historia.id,
      clienteId: this.clienteActualId,
      comentario: historia.nuevoComentario,
    };

    this.historiaService.comentarHistoria(request).subscribe({
      next: (resp) => {
        if (resp.success) {
          historia.comentarios.push({
            id: resp.comentarioId,
            clienteId: this.clienteActualId,
            nombreCliente: 'Tú',
            comentario: historia.nuevoComentario,
            fechaComentario: new Date().toISOString(),
            likes: 0,
            yaLeDiLike: false,
          });
          historia.nuevoComentario = '';
        }
        historia.comentarioEnviando = false;
      },
      error: () => {
        historia.comentarioEnviando = false;
      },
    });
  }
}
