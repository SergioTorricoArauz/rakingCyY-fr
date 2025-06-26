import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ClientesService } from '../../services/clientes.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  errorMsg: string | null = null;
  successMsg: string | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly clientesService: ClientesService,
    private readonly router: Router
  ) {
    this.registerForm = this.fb.nonNullable.group(
      {
        nombre: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(50),
          ],
        ],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: [this.passwordMatchValidator],
      }
    );
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      const errors = confirmPassword.errors;
      if (errors) {
        delete errors['passwordMismatch'];
        confirmPassword.setErrors(
          Object.keys(errors).length === 0 ? null : errors
        );
      }
    }

    return null;
  }

  get nombre() {
    return this.registerForm.get('nombre');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.loading = true;
      this.errorMsg = null;
      this.successMsg = null;

      const formData = { ...this.registerForm.value };
      delete formData.confirmPassword;

      this.clientesService.registerCliente(formData).subscribe({
        next: (response) => {
          this.loading = false;
          this.successMsg =
            'Cliente registrado exitosamente. Redirigiendo al login...';

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (err) => {
          this.loading = false;
          if (err.status === 400) {
            this.errorMsg =
              err.error?.message ?? 'Error en los datos proporcionados.';
          } else if (err.status === 409) {
            this.errorMsg = 'El email ya está registrado.';
          } else {
            this.errorMsg =
              'Error al registrar el cliente. Inténtalo de nuevo.';
          }
        },
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.registerForm.controls).forEach((key) => {
      const control = this.registerForm.get(key);
      control?.markAsTouched();
    });
  }
}
