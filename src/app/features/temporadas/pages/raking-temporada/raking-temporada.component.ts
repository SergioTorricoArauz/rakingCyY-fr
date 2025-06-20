import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Puntaje } from '../../../../models/puntaje';
import { PuntajesService } from '../../../../core/services/puntajes.service';
import { ActivatedRoute } from '@angular/router';
import { TemporadasService } from '../../services/temporadas.service';

@Component({
  selector: 'app-raking-temporada',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './raking-temporada.component.html',
  styleUrl: './raking-temporada.component.css'
})
export class RakingTemporadaComponent implements OnInit {
  puntajes: Puntaje[] = [];
  temporadaNombre: string = '';
  loading = false;
  errorMsg: string | null = null;
  usuarioYaEnRanking: boolean = false;
  estaDisponible: boolean = false;

  constructor(
    private puntajesService: PuntajesService,
    private temporadasService: TemporadasService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loading = true;
    const temporadaId = Number(this.route.snapshot.paramMap.get('id'));
    const clienteId = Number(localStorage.getItem('currentUserId'));

    // Solo aquí se consulta si el usuario ya participa
    this.temporadasService.clienteParticipaEnTemporada(clienteId, temporadaId).subscribe({
      next: (yaParticipa) => {
        this.usuarioYaEnRanking = yaParticipa;
      },
      error: () => {
        this.usuarioYaEnRanking = false;
      }
    });

    // Obtén los datos de la temporada
    this.temporadasService.getTemporadaById(temporadaId).subscribe({
      next: (temporada) => {
        this.temporadaNombre = temporada.nombre;
        this.estaDisponible = temporada.estaDisponible;
      }
    });

    // Carga el ranking
    this.puntajesService.getRanking(temporadaId).subscribe({
      next: (data) => {
        this.puntajes = data;
        this.loading = false;
        this.errorMsg = null;
      },
      error: (err) => {
        if (
          err.error === 'No se encontraron puntajes para la temporada especificada.' ||
          err.status === 404
        ) {
          this.puntajes = [];
          this.errorMsg = null;
        } else {
          this.errorMsg = 'Error al cargar el ranking';
        }
        this.loading = false;
      }
    });
  }

  unirmeATemporada(): void {
    const clienteId = Number(localStorage.getItem('currentUserId'));
    const temporadaId = Number(this.route.snapshot.paramMap.get('id'));

    if (!clienteId || !temporadaId) {
      this.errorMsg = 'No se pudo obtener el usuario o la temporada.';
      return;
    }

    // Verifica primero si ya participa
    this.temporadasService.clienteParticipaEnTemporada(clienteId, temporadaId).subscribe({
      next: (yaParticipa) => {
        if (yaParticipa) {
          this.usuarioYaEnRanking = true;
          this.errorMsg = 'Ya estás participando en esta temporada.';
          return;
        }

        // Si no participa, lo registra
        this.puntajesService.registerClienteTemporada({
          puntos: 0,
          clienteId,
          temporadaId
        }).subscribe({
          next: () => {
            // Vuelve a consultar la participación para actualizar el botón
            this.temporadasService.clienteParticipaEnTemporada(clienteId, temporadaId).subscribe({
              next: (participaDespues) => {
                this.usuarioYaEnRanking = participaDespues;
              },
              error: () => {
                this.usuarioYaEnRanking = false;
              }
            });
            // Recarga el ranking
            this.puntajesService.getRanking(temporadaId).subscribe({
              next: (data) => {
                this.puntajes = data;
                this.loading = false;
              },
              error: () => {
                this.errorMsg = 'Error al actualizar el ranking';
                this.loading = false;
              }
            });
          },
          error: () => {
            this.loading = false;
            this.errorMsg = 'No se pudo unir a la temporada.';
          }
        });
      },
      error: () => {
        this.errorMsg = 'No se pudo verificar la participación en la temporada.';
      }
    });
  }
}