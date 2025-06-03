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
        this.loading = false;
      },
      error: (err) => {
        this.errorMsg = 'Error al cargar el ranking';
        this.loading = false;
      }
    });
  }
}