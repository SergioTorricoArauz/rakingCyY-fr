import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  HistoriaActiva,
  ComentarioHistoria,
  CrearComentarioRequest,
} from '../../models/historia';
import { HistoriasService } from '../../services/historias.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BoliviaDatePipe } from '../../../../shared/pipes/bolivia-date.pipe';

type HistoriaActivaExt = HistoriaActiva & {
  nuevoComentario?: string;
  comentarioEnviando?: boolean;
};

@Component({
  selector: 'app-historias',
  templateUrl: './historias.component.html',
  styleUrls: ['./historias.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, BoliviaDatePipe],
})
export class HistoriasComponent implements OnInit, OnDestroy {
  historias: HistoriaActivaExt[] = [];
  loading = true;
  clienteActualId: number = 0;

  private readonly subscriptions: Subscription[] = [];

  constructor(private readonly historiaService: HistoriasService) {}

  ngOnInit(): void {
    this.clienteActualId = Number(localStorage.getItem('currentUserId')) || 0;

    if (this.clienteActualId === 0) {
      console.warn('Usuario no autenticado');
      return;
    }
    this.historiaService.inicializar().then(() => {
      this.cargarHistorias();
      this.configurarEventosSignalR();
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());

    this.historias.forEach((historia) => {
      this.historiaService.salirDeGrupoHistoria(historia.id);
    });
  }

  private cargarHistorias(): void {
    this.historiaService.getHistoriasActivas(this.clienteActualId).subscribe({
      next: (data) => {
        this.historias = data.map((historia) => ({
          ...historia,
          nuevoComentario: '',
          comentarioEnviando: false,
          comentarios: historia.comentarios.map((comentario) => ({
            ...comentario,
            nombreCliente:
              comentario.clienteId === this.clienteActualId
                ? 'Yo'
                : comentario.nombreCliente,
          })),
        }));
        this.loading = false;
        this.actualizarLikesComentarios();

        this.historias.forEach((historia) => {
          this.historiaService.unirseAGrupoHistoria(historia.id);
        });

        console.log('Historias cargadas:', this.historias.length);
      },
      error: (error) => {
        console.error('Error al cargar historias:', error);
        this.loading = false;
      },
    });
  }

  private configurarEventosSignalR(): void {
    const nuevaHistoriaSub = this.historiaService.nuevaHistoria$.subscribe(
      (nuevaHistoria) => {
        if (nuevaHistoria) {
          console.log('Procesando nueva historia:', nuevaHistoria);
          const historiaExt: HistoriaActivaExt = {
            ...nuevaHistoria,
            nuevoComentario: '',
            comentarioEnviando: false,
            comentarios: nuevaHistoria.comentarios.map((comentario) => ({
              ...comentario,
              nombreCliente:
                comentario.clienteId === this.clienteActualId
                  ? 'Yo'
                  : comentario.nombreCliente,
            })),
          };

          this.historias.unshift(historiaExt);

          this.historiaService.unirseAGrupoHistoria(nuevaHistoria.id);

          console.log('Nueva historia agregada. Total:', this.historias.length);
        }
      }
    );

    const nuevoComentarioSub = this.historiaService.nuevoComentario$.subscribe(
      (data) => {
        if (data) {
          console.log('Procesando nuevo comentario:', data);
          const historia = this.historias.find((h) => h.id === data.historiaId);
          if (historia) {
            if (data.comentario.clienteId !== this.clienteActualId) {
              const comentarioProcesado = {
                ...data.comentario,
                nombreCliente:
                  data.comentario.clienteId === this.clienteActualId
                    ? 'Yo'
                    : data.comentario.nombreCliente,
              };
              historia.comentarios.push(comentarioProcesado);
              console.log(
                'Comentario agregado en tiempo real:',
                comentarioProcesado
              );
            }
          }
        }
      }
    );

    const likesActualizadoSub =
      this.historiaService.comentarioLikeActualizado$.subscribe((data) => {
        if (data) {
          console.log('Procesando actualización de likes:', data);
          for (const historia of this.historias) {
            const comentario = historia.comentarios.find(
              (c) => c.id === data.comentarioId
            );
            if (comentario) {
              if (!comentario._likeLoading) {
                comentario.likes = data.likes;
              }
              break;
            }
          }
        }
      });

    this.subscriptions.push(
      nuevaHistoriaSub,
      nuevoComentarioSub,
      likesActualizadoSub
    );
  }

  actualizarLikesComentarios(): void {
    this.historias.forEach((historia) => {
      historia.comentarios.forEach((comentario) => {
        this.historiaService
          .getComentario(comentario.id, this.clienteActualId)
          .subscribe({
            next: (comentarioActualizado: ComentarioHistoria) => {
              comentario.yaLeDiLike = comentarioActualizado.yaLeDiLike;
            },
            error: (error) => {
              console.error(
                `Error al actualizar likes del comentario ${comentario.id}:`,
                error
              );
            },
          });
      });
    });
  }

  toggleLike(comentario: ComentarioHistoria): void {
    if (comentario._likeLoading) return;

    comentario._likeLoading = true;

    const likesOriginales = comentario.likes;
    const yaLeDiLikeOriginal = comentario.yaLeDiLike;

    comentario.yaLeDiLike = !comentario.yaLeDiLike;
    comentario.likes += comentario.yaLeDiLike ? 1 : -1;

    this.historiaService
      .likeComentario(comentario.id, this.clienteActualId)
      .subscribe({
        next: (resp) => {
          comentario.likes = resp.comentario.likes;
          comentario.yaLeDiLike = resp.comentario.yaLeDiLike;
          comentario._likeLoading = false;
          console.log(`Like actualizado para comentario ${comentario.id}`);
        },
        error: (error) => {
          comentario.likes = likesOriginales;
          comentario.yaLeDiLike = yaLeDiLikeOriginal;
          comentario._likeLoading = false;
          console.error('Error al dar like:', error);
        },
      });
  }

  enviarComentario(historia: HistoriaActivaExt): void {
    if (!historia.nuevoComentario?.trim() || historia.comentarioEnviando)
      return;

    historia.comentarioEnviando = true;
    const comentarioTexto = historia.nuevoComentario.trim();

    const request: CrearComentarioRequest = {
      historiaId: historia.id,
      clienteId: this.clienteActualId,
      comentario: comentarioTexto,
    };

    this.historiaService.comentarHistoria(request).subscribe({
      next: (resp) => {
        if (resp.success) {
          const nuevoComentario: ComentarioHistoria = {
            id: resp.comentarioId,
            clienteId: this.clienteActualId,
            nombreCliente: 'Yo',
            comentario: comentarioTexto,
            fechaComentario: new Date().toISOString(),
            likes: 0,
            yaLeDiLike: false,
          };

          historia.comentarios.push(nuevoComentario);
          historia.nuevoComentario = '';
          console.log(`Comentario enviado a historia ${historia.id}`);
        }
        historia.comentarioEnviando = false;
      },
      error: (error) => {
        console.error('Error al enviar comentario:', error);
        historia.comentarioEnviando = false;
      },
    });
  }

  get connectionState(): string {
    return this.historiaService.connectionState;
  }
}
