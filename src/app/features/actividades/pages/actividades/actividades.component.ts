import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActividadesService } from '../../services/actividades.service';

@Component({
  selector: 'app-actividades',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './actividades.component.html',
  styleUrl: './actividades.component.css'
})
export class ActividadesComponent implements OnInit{
  actividades: any[] = [];
  loading = false;
  errorMsg: string | null = null;

  constructor(
    private actividadService: ActividadesService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.getActividades();
  }
  
  getActividades(): void {
    this.loading = true;
    this.actividadService.getActividades().subscribe({
      next: (data) => {
        this.actividades = data;
        this.loading = false;
      },
      error: (err) => {
        this.errorMsg = 'Error al cargar las actividades';
        this.loading = false;
      }
    });
  }

}
