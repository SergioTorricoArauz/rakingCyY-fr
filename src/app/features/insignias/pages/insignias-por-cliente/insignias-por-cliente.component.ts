import { Component, OnInit } from '@angular/core';
import { Insignias } from '../../models/insignias';
import { InsigniasService } from '../../services/insignias.service';
import { AuthService } from '../../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-insignias-por-cliente',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './insignias-por-cliente.component.html',
  styleUrl: './insignias-por-cliente.component.css',
})
export class InsigniasPorClienteComponent implements OnInit {
  insignias: Insignias[] = [];
  loading = false;
  errorMsg: string | null = null;
  currentUser: { id: number; nombre: string } | null = null;

  constructor(
    private readonly insigniasService: InsigniasService,
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      this.errorMsg = 'Debe iniciar sesión para ver su perfil.';
      return;
    }

    this.loadInsignias();
  }

  private loadInsignias(): void {
    if (!this.currentUser) return;

    this.loading = true;
    this.insigniasService
      .getInsigniasPorCliente(this.currentUser.id)
      .subscribe({
        next: (data: Insignias[]) => {
          this.insignias = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error al cargar insignias', err);
          this.errorMsg = 'No se pudieron cargar las insignias.';
          this.loading = false;
        },
      });
  }
}
