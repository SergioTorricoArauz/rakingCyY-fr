import { Component, OnInit } from '@angular/core';
import { HistoriasService } from '../../services/historias.service';
import { ComentarioHistoria } from '../../models/historia';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Extender la interfaz para el uso en este componente
interface ComentarioHistoriaExt extends ComentarioHistoria {
  nombreHistoria?: string;
  imagenes?: { url: string; nombreArchivo: string }[];
  comentarios?: ComentarioHistoria[];
}

@Component({
  selector: 'app-historias-all',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './historias-all.component.html',
  styleUrl: './historias-all.component.css',
})
export class HistoriasAllComponent implements OnInit {
  comentarios: ComentarioHistoriaExt[] = [];
  comentariosMostrados: ComentarioHistoriaExt[] = [];
  mostrarCantidad = 3;
  loading = false;
  errorMsg: string | null = null;

  constructor(private readonly historiasService: HistoriasService) {}

  ngOnInit() {
    this.loading = true;
    this.historiasService.getAllHistorias().subscribe({
      next: (data) => {
        // Hacemos type assertion para evitar errores de linter
        this.comentarios = data as ComentarioHistoriaExt[];
        this.comentariosMostrados = this.comentarios.slice(
          0,
          this.mostrarCantidad
        );
        this.loading = false;
      },
      error: (err) => {
        this.errorMsg = 'Error al cargar historias';
        this.loading = false;
      },
    });
  }

  verMas() {
    const nuevos = this.comentarios.slice(
      0,
      this.comentariosMostrados.length + this.mostrarCantidad
    );
    this.comentariosMostrados = nuevos;
  }

  hayMas(): boolean {
    return this.comentariosMostrados.length < this.comentarios.length;
  }
}
