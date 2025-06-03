import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Puntaje } from '../../../../models/puntaje';
import { PuntajesService } from '../../../../core/services/puntajes.service';
import { ActivatedRoute } from '@angular/router';

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
  usuarioYaEnRanking: boolean = true;

  constructor(
    private puntajesService: PuntajesService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loading = true;
    const temporadaId = Number(this.route.snapshot.paramMap.get('id'));

    this.puntajesService.getRanking(temporadaId).subscribe({
      next: (data) => {
        this.puntajes = data;
        this.temporadaNombre = data.length > 0 && data[0].temporadaNombre ? data[0].temporadaNombre : '';
        const clienteId = Number(localStorage.getItem('currentUserId'));
        console.log('clienteId:', clienteId);
        console.log('puntajes:', this.puntajes);

        this.usuarioYaEnRanking = this.puntajes.some(p => p.clienteId === clienteId);
        console.log('usuarioYaEnRanking:', this.usuarioYaEnRanking);

        this.loading = false;
        this.loading = false;
      },
      error: (err) => {
        this.errorMsg = 'Error al cargar el ranking';
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
    this.puntajesService.registerClienteTemporada({
      puntos: 0,
      clienteId,
      temporadaId
    }).subscribe({
      next: () => {
        // Vuelve a cargar el ranking después de unirse
        this.puntajesService.getRanking(temporadaId).subscribe({
          next: (data) => {
            this.puntajes = data;
            this.usuarioYaEnRanking = this.puntajes.some(p => p.clienteId === clienteId);
            this.loading = false;
            this.usuarioYaEnRanking = true;
          },
          error: (err) => {
            this.errorMsg = 'Error al actualizar el ranking';
            this.loading = false;

          }
        });
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = 'No se pudo unir a la temporada.';
      }
    });
  }
}