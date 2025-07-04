import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { TemporadasService } from '../../services/temporadas.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-crear-temporada',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './crear-temporada.component.html',
  styleUrl: './crear-temporada.component.css',
})
export class CrearTemporadaComponent {
  temporadaForm: FormGroup;
  successMsg: string | null = null;
  errorMsg: string | null = null;
  loading = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly temporadasService: TemporadasService
  ) {
    this.temporadaForm = this.fb.group({
      nombre: ['', Validators.required],
      inicio: ['', Validators.required],
      fin: ['', Validators.required],
      estaDisponible: [true, Validators.required],
    });
  }

  onSubmit() {
    if (this.temporadaForm.invalid) {
      this.temporadaForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.successMsg = null;
    this.errorMsg = null;

    const formValue = this.temporadaForm.value;

    // Convertir fechas a UTC (agregar T00:00:00Z)
    const inicio = new Date(formValue.inicio + 'T00:00:00Z').toISOString();
    const fin = new Date(formValue.fin + 'T00:00:00Z').toISOString();

    const payload = {
      ...formValue,
      inicio,
      fin,
    };

    this.temporadasService.registerTemporada(payload).subscribe({
      next: (temporada) => {
        this.successMsg = `Temporada "${temporada.nombre}" creada correctamente.`;
        this.temporadaForm.reset({ estaDisponible: true });
        this.loading = false;
      },
      error: (err) => {
        this.errorMsg = 'Error al crear la temporada. Intenta de nuevo.';
        this.loading = false;
      },
    });
  }
}
