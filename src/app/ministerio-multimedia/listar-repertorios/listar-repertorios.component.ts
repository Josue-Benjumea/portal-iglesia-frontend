import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RepertorioService } from '../../services/repertorio.service';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-listar-repertorios',
  templateUrl: './listar-repertorios.component.html',
  styleUrls: ['./listar-repertorios.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    RouterModule,

  ]
})
export class ListarRepertoriosComponent implements OnInit {
  repertorios: any[] = [];
  loading = false;

  constructor(
    private repertorioService: RepertorioService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.cargarRepertorios();
  }

  cargarRepertorios(): void {
    this.loading = true;
    // Clear any cached data
    localStorage.removeItem('repertoriosList');
    
    this.repertorioService.obtenerRepertoriosPendientes()
      .subscribe({
        next: (data) => {
          console.log('Repertorios cargados:', data); // Add logging
          this.repertorios = data;
          this.loading = false;
        },
        error: (error) => {
          this.loading = false;
          this.snackBar.open('Error al cargar los repertorios: ' + (error.error?.error || 'Error desconocido'), 'Cerrar', {
            duration: 5000
          });
        }
      });
  }

  editarRepertorio(repertorioId: number): void {
    // Guardar el ID del repertorio en localStorage para usarlo en el componente de edición
    localStorage.setItem('repertorioId', repertorioId.toString());
    this.router.navigate(['/multimedia/editar-diapositivas']);
  }

  formatDate(dateString: string): string {
    console.log('Raw date string:', dateString); // Debug log
    
    // Handle the case where the date might be in a different format
    let date;
    
    if (dateString.includes('T')) {
      // If it's in ISO format with time
      date = new Date(dateString);
    } else {
      // If it's in YYYY-MM-DD format
      const parts = dateString.split('-');
      if (parts.length === 3) {
        // Create date with explicit year, month, day to avoid timezone issues
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // JS months are 0-indexed
        const day = parseInt(parts[2], 10);
        date = new Date(year, month, day);
      } else {
        date = new Date(dateString);
      }
    }
    
    // Verify the date is valid
    if (isNaN(date.getTime())) {
      console.error('Invalid date after parsing:', dateString);
      return 'Fecha inválida';
    }
    
    console.log('Parsed date object:', date.toISOString());
    
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
