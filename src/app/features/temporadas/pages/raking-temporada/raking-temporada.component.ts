import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Puntaje } from '../../../../models/puntaje';
import { PuntajesService } from '../../../../core/services/puntajes.service';
import { ActivatedRoute } from '@angular/router';
import { TemporadasService } from '../../services/temporadas.service';
import { TemporadaUtils } from '../../models/temporada';
import { TemporadaEstado } from '../../models/temporada-estado.enum';

@Component({
  selector: 'app-raking-temporada',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './raking-temporada.component.html',
  styleUrl: './raking-temporada.component.css',
})
export class RakingTemporadaComponent implements OnInit, OnDestroy {
  puntajes: Puntaje[] = [];
  temporadaNombre: string = '';
  loading = false;
  errorMsg: string | null = null;
  usuarioYaEnRanking: boolean = false;
  estaDisponible: boolean = false;
  estado: TemporadaEstado = TemporadaEstado.PENDIENTE;
  finTemporada!: Date;
  inicioTemporada!: Date;
  tiempoRestante: string = '';
  intervalId: any;
  mensajeEstado: string = '';
  puedeParticipar: boolean = false;
  claseEstado: string = '';

  constructor(
    private readonly puntajesService: PuntajesService,
    private readonly temporadasService: TemporadasService,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loading = true;
    const temporadaId = Number(this.route.snapshot.paramMap.get('id'));
    const clienteId = Number(localStorage.getItem('currentUserId'));

    // Solo aquí se consulta si el usuario ya participa
    this.temporadasService
      .clienteParticipaEnTemporada(clienteId, temporadaId)
      .subscribe({
        next: (yaParticipa) => {
          this.usuarioYaEnRanking = yaParticipa;
        },
        error: () => {
          this.usuarioYaEnRanking = false;
        },
      });

    // Obtén los datos de la temporada
    this.temporadasService.getTemporadaById(temporadaId).subscribe({
      next: (temporada) => {
        this.temporadaNombre = temporada.nombre;
        this.estaDisponible = temporada.estaDisponible;
        this.estado = temporada.estado;
        this.inicioTemporada = new Date(temporada.inicio);
        this.finTemporada = new Date(temporada.fin);

        // Configurar mensajes y permisos usando las utilidades
        this.configurarEstadoTemporada(temporada);

        this.actualizarTiempoRestante();
        this.intervalId = setInterval(
          () => this.actualizarTiempoRestante(),
          1000
        );
      },
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
          err.error ===
            'No se encontraron puntajes para la temporada especificada.' ||
          err.status === 404
        ) {
          this.puntajes = [];
          this.errorMsg = null;
        } else {
          this.errorMsg = 'Error al cargar el ranking';
        }
        this.loading = false;
      },
    });
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  unirmeATemporada(): void {
    const clienteId = Number(localStorage.getItem('currentUserId'));
    const temporadaId = Number(this.route.snapshot.paramMap.get('id'));

    if (!clienteId || !temporadaId) {
      this.errorMsg = 'No se pudo obtener el usuario o la temporada.';
      return;
    }

    // Verifica primero si ya participa
    this.temporadasService
      .clienteParticipaEnTemporada(clienteId, temporadaId)
      .subscribe({
        next: (yaParticipa) => {
          if (yaParticipa) {
            this.usuarioYaEnRanking = true;
            this.errorMsg = 'Ya estás participando en esta temporada.';
            return;
          }

          // Si no participa, lo registra
          this.puntajesService
            .registerClienteTemporada({
              puntos: 0,
              clienteId,
              temporadaId,
            })
            .subscribe({
              next: () => {
                // Vuelve a consultar la participación para actualizar el botón
                this.temporadasService
                  .clienteParticipaEnTemporada(clienteId, temporadaId)
                  .subscribe({
                    next: (participaDespues) => {
                      this.usuarioYaEnRanking = participaDespues;
                    },
                    error: () => {
                      this.usuarioYaEnRanking = false;
                    },
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
                  },
                });
              },
              error: () => {
                this.loading = false;
                this.errorMsg = 'No se pudo unir a la temporada.';
              },
            });
        },
        error: () => {
          this.errorMsg =
            'No se pudo verificar la participación en la temporada.';
        },
      });
  }

  actualizarTiempoRestante() {
    if (TemporadaUtils.estaPendiente(this.estado)) {
      if (!this.inicioTemporada) {
        this.tiempoRestante = '';
        return;
      }
      // Usar hora de Bolivia
      const ahora = new Date();
      const horaBolivia = new Date(
        ahora.toLocaleString('en-US', { timeZone: 'America/La_Paz' })
      );
      const diff = this.inicioTemporada.getTime() - horaBolivia.getTime();
      if (diff <= 0) {
        this.tiempoRestante = '¡La temporada está por comenzar!';
        return;
      }
      const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
      const horas = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutos = Math.floor((diff / (1000 * 60)) % 60);
      const segundos = Math.floor((diff / 1000) % 60);
      this.tiempoRestante = `Comienza en: ${dias} días, ${horas} horas, ${minutos} minutos, ${segundos} segundos`;
    } else {
      if (!this.finTemporada) {
        this.tiempoRestante = '';
        return;
      }
      // Usar hora de Bolivia
      const ahora = new Date();
      const horaBolivia = new Date(
        ahora.toLocaleString('en-US', { timeZone: 'America/La_Paz' })
      );
      const diff = this.finTemporada.getTime() - horaBolivia.getTime();
      if (diff <= 0) {
        return;
      }
      const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
      const horas = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutos = Math.floor((diff / (1000 * 60)) % 60);
      const segundos = Math.floor((diff / 1000) % 60);
      this.tiempoRestante = `Termina en: ${dias} días, ${horas} horas, ${minutos} minutos, ${segundos} segundos`;
    }
  }

  private configurarEstadoTemporada(temporada: any): void {
    // Usar las utilidades para configurar el estado
    this.mensajeEstado = TemporadaUtils.getMensajeEstado(temporada.estado);
    this.puedeParticipar = TemporadaUtils.puedeParticipar(temporada.estado);
    this.claseEstado = TemporadaUtils.getClaseEstado(temporada.estado);
  }
}
