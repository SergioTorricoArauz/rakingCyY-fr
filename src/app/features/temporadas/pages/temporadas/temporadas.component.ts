import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemporadasService } from '../../services/temporadas.service';
import { Temporada } from '../../models/temporada';

@Component({
  selector: 'app-temporadas',
  standalone: true,              // Marca el componente como standalone
  imports: [CommonModule],       // Para usar *ngFor, *ngIf, etc.
  templateUrl: './temporadas.component.html',
  styleUrls: ['./temporadas.component.css']
})
export class TemporadasComponent implements OnInit {
  temporadas: Temporada[] = [];  // Aquí guardaremos la lista recibida
  loading = false;
  errorMsg: string | null = null;

  constructor(private temporadasService: TemporadasService) { }

  ngOnInit(): void {
    this.loading = true;
    this.temporadasService.getTemporadas().subscribe({
      next: (data) => {
        this.temporadas = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al traer temporadas', err);
        this.errorMsg = 'No se pudieron cargar las temporadas.';
        this.loading = false;
      }
    });
  }
}
