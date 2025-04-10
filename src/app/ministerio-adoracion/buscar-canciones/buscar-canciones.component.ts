import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { CancionService } from '../../services/cancion.service';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-buscar-canciones',
  templateUrl: './buscar-canciones.component.html',
  styleUrls: ['./buscar-canciones.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatProgressSpinnerModule
  ]
})
export class BuscarCancionesComponent implements OnInit {
  searchControl = new FormControl('');
  resultados: any[] = [];
  cancionesSeleccionadas: any[] = [];
  loading = false;
  error = '';

  constructor(
    private cancionService: CancionService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(query => {
        if (!query || query.trim() === '') {
          return of({ data: [] });
        }
        
        this.loading = true;
        return this.cancionService.buscarCanciones(query).pipe(
          catchError(error => {
            this.error = 'Error al buscar canciones. Intente nuevamente.';
            this.snackBar.open(this.error, 'Cerrar', {
              duration: 5000
            });
            return of({ data: [] });
          })
        );
      })
    ).subscribe(response => {
      this.loading = false;
      this.resultados = response.data || [];
    });
  }

  seleccionarCancion(cancion: any): void {
    // Verificar si la canción ya está seleccionada
    const yaSeleccionada = this.cancionesSeleccionadas.some(c => c.id === cancion.id);
    
    if (!yaSeleccionada) {
      this.cancionesSeleccionadas.push(cancion);
      this.snackBar.open(`"${cancion.title}" agregada al repertorio`, 'Cerrar', {
        duration: 3000
      });
    } else {
      this.snackBar.open('Esta canción ya está en el repertorio', 'Cerrar', {
        duration: 3000
      });
    }
  }

  eliminarCancion(index: number): void {
    this.cancionesSeleccionadas.splice(index, 1);
  }

  continuarCreacion(): void {
    if (this.cancionesSeleccionadas.length === 0) {
      this.snackBar.open('Debe seleccionar al menos una canción', 'Cerrar', {
        duration: 3000
      });
      return;
    }
    
    // Guardar las canciones seleccionadas en localStorage para usarlas en el siguiente paso
    localStorage.setItem('cancionesSeleccionadas', JSON.stringify(this.cancionesSeleccionadas));
    this.router.navigate(['/adoracion/crear-repertorio']);
  }
}
