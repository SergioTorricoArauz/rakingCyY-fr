import { Component, OnInit } from '@angular/core';
import { HistoriaActiva, ComentarioHistoria } from '../../models/historia';
import { HistoriasService } from '../../services/historias.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-historias',
  templateUrl: './historias.component.html',
  styleUrls: ['./historias.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class HistoriasComponent implements OnInit {
  historias: HistoriaActiva[] = [];
  loading = true;
  clienteActualId = 6; // <-- aquí pon el id del usuario en sesión

  constructor(private readonly historiaService: HistoriasService) {}

  ngOnInit(): void {
    this.historiaService.getHistoriasActivas().subscribe({
      next: (data) => {
        this.historias = data;
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
}
