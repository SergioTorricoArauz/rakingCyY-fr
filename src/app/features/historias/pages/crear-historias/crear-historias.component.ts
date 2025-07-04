import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { HistoriasService } from '../../services/historias.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-crear-historias',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './crear-historias.component.html',
  styleUrl: './crear-historias.component.css',
})
export class CrearHistoriasComponent {
  historiaForm: FormGroup;
  imagenes: File[] = [];
  successMsg: string | null = null;
  errorMsg: string | null = null;
  loading = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly historiasService: HistoriasService
  ) {
    this.historiaForm = this.fb.group({
      clienteId: [1, Validators.required], // Puedes cambiar el valor por el id real del usuario
      descripcion: ['', Validators.required],
      duracionHoras: [1, [Validators.required, Validators.min(1)]],
      permiteComentarios: [true, Validators.required],
      imagenes: [null],
    });
  }

  onFileChange(event: any) {
    this.imagenes = Array.from(event.target.files);
  }

  onSubmit() {
    if (this.historiaForm.invalid) {
      this.historiaForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.successMsg = null;
    this.errorMsg = null;

    const formValue = this.historiaForm.value;
    this.historiasService
      .crearHistoria({
        clienteId: formValue.clienteId,
        descripcion: formValue.descripcion,
        duracionHoras: formValue.duracionHoras,
        permiteComentarios: formValue.permiteComentarios,
        imagenes: this.imagenes,
      })
      .subscribe({
        next: (resp) => {
          this.successMsg =
            'Historia creada correctamente. ID: ' + resp.historiaId;
          this.errorMsg = null;
          this.historiaForm.reset({
            permiteComentarios: true,
            duracionHoras: 1,
          });
          this.imagenes = [];
          this.loading = false;
        },
        error: (err) => {
          this.errorMsg = 'Error al crear la historia';
          this.successMsg = null;
          this.loading = false;
        },
      });
  }
}
