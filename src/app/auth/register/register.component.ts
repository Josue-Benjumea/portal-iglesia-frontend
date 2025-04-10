import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    RouterModule,
    MatIconModule, // Añade esta línea
    MatProgressSpinnerModule
  ]
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';

  ministerios = [
    'Ministerio de danza',
    'Ministerio de alabanza',
    'Ministerio de multimedia',
    'Ministerio pastoral',
    'Ministerio profetico',
    'Ministerio apospolico',
    'Ministerio educacional',
    'Administracion'
  ];
  
// Añade estas propiedades a tu clase de componente
hidePassword = true;
hideConfirmPassword = true;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      edad: ['', [Validators.required, Validators.min(1), Validators.max(120)]],
      cedula: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      ministerio: ['', Validators.required]
    }, {
      validator: this.mustMatch('password', 'confirmPassword')
    });
  }

  // Validador personalizado para que las contraseñas coincidan
  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        return;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  // Getter para acceder fácilmente a los campos del formulario
  get f() { return this.registerForm.controls; }

  // In your onSubmit method
  onSubmit() {
    this.submitted = true;
  
    // Detener si el formulario es inválido
    if (this.registerForm.invalid) {
      return;
    }
  
    this.loading = true;
    
    // Log the form values before sending
    console.log('Form values:', this.registerForm.value);
    
    this.authService.register({
      nombre: this.f['nombre'].value,
      apellido: this.f['apellido'].value,
      edad: this.f['edad'].value,
      cedula: this.f['cedula'].value,
      email: this.f['email'].value,
      password: this.f['password'].value,
      ministerio: this.f['ministerio'].value
    })
    .subscribe({
      next: () => {
        this.snackBar.open('Registro exitoso. Por favor inicia sesión.', 'Cerrar', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
        this.router.navigate(['/auth/login']);
      },
      error: error => {
        console.error('Registration error:', error);
        this.error = error.error.error || 'Error en el registro';
        this.loading = false;
        this.snackBar.open(this.error, 'Cerrar', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
      }
    });
  }
}

