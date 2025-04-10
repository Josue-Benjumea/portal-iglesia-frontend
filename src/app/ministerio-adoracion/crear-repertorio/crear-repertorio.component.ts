import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RepertorioService } from '../../services/repertorio.service';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-crear-repertorio',
  templateUrl: './crear-repertorio.component.html',
  styleUrls: ['./crear-repertorio.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule
  ]
})
export class CrearRepertorioComponent implements OnInit {
  repertorioForm!: FormGroup;
  cancionesSeleccionadas: any[] = [];
  loading = false;
  minDate = new Date();

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private repertorioService: RepertorioService
  ) { }

  ngOnInit(): void {
    // Recuperar las canciones seleccionadas del localStorage
    const cancionesJson = localStorage.getItem('cancionesSeleccionadas');
    
    if (!cancionesJson) {
      this.snackBar.open('No hay canciones seleccionadas. Vuelva a la búsqueda.', 'Cerrar', {
        duration: 5000
      });
      this.router.navigate(['/adoracion/buscar-canciones']);
      return;
    }
    
    this.cancionesSeleccionadas = JSON.parse(cancionesJson);
    
    this.repertorioForm = this.formBuilder.group({
      fecha: ['', Validators.required]
    });
  }

  guardarRepertorio(): void {
    if (this.repertorioForm.invalid) {
      return;
    }
    
    this.loading = true;
    
    // Formatear las canciones para enviar al backend
    const canciones = this.cancionesSeleccionadas.map(cancion => ({
      titulo: cancion.title,
      artista: cancion.artist.name
    }));
    
    // Formatear la fecha en formato ISO (YYYY-MM-DD)
    const fecha = this.formatDate(this.repertorioForm.value.fecha);
    
    this.repertorioService.crearRepertorio(fecha, canciones)
      .subscribe({
        next: (response) => {
          this.loading = false;
          this.snackBar.open('Repertorio creado exitosamente', 'Cerrar', {
            duration: 5000
          });
          
          // Limpiar el localStorage
          localStorage.removeItem('cancionesSeleccionadas');
          
          // Redirigir al dashboard
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.loading = false;
          this.snackBar.open('Error al crear el repertorio: ' + (error.error?.error || 'Error desconocido'), 'Cerrar', {
            duration: 5000
          });
        }
      });
  }

  eliminarCancion(index: number): void {
    this.cancionesSeleccionadas.splice(index, 1);
    
    if (this.cancionesSeleccionadas.length === 0) {
      this.snackBar.open('No hay canciones seleccionadas. Vuelva a la búsqueda.', 'Cerrar', {
        duration: 5000
      });
      this.router.navigate(['/adoracion/buscar-canciones']);
    } else {
      // Actualizar el localStorage
      localStorage.setItem('cancionesSeleccionadas', JSON.stringify(this.cancionesSeleccionadas));
    }
  }

  volver(): void {
    this.router.navigate(['/adoracion/buscar-canciones']);
  }

  private formatDate(date: Date): string {
    if (!date) {
      console.error('Error: fecha inválida', date);
      return '';
    }
    
    const d = new Date(date);
    
    // Verificar que la fecha es válida
    if (isNaN(d.getTime())) {
      console.error('Error: fecha inválida después de conversión', date);
      return '';
    }
    
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
  
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
  
    const formattedDate = [year, month, day].join('-');
    console.log('Fecha formateada:', formattedDate);
    return formattedDate;
  }

  // Add this method to match the template
  onSubmit(): void {
    this.guardarRepertorio();
  }
}
