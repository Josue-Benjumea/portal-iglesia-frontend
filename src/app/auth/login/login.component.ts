import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string = '/dashboard';
  error = '';
  logoPath = 'assets/images/Logo_Iglesia.jpg';
  logoPath2 = 'assets/images/Logo_login.jpg';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    // Redirigir al dashboard si ya está autenticado
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      cedula: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      password: ['', Validators.required]
    });

    // Obtener la URL de retorno de los parámetros de la ruta o usar el valor predeterminado
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  // Getter para acceder fácilmente a los campos del formulario
  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;

    // Detener si el formulario es inválido
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authService.login(this.f['cedula'].value, this.f['password'].value)
      .subscribe({
        next: () => {
          // Determinar la ruta basada en el ministerio del usuario
          const ministerio = this.authService.getUserMinisterio();
          let redirectUrl = this.returnUrl;
          
          if (ministerio === 'Ministerio de alabanza') {
            redirectUrl = '/adoracion';
          } else if (ministerio === 'Ministerio de multimedia') {
            redirectUrl = '/multimedia';
          }
          
          this.router.navigate([redirectUrl]);
        },
        error: error => {
          this.error = error.error.error || 'Error en el inicio de sesión';
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
