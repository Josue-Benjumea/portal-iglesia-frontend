import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule,
  ]
})
export class DashboardComponent implements OnInit {
  userName: string = '';
  userMinisterio: string = '';
  isMultimedia: boolean = false;
  isAdoracion: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const currentUser = this.authService.currentUserValue;
    if (currentUser && currentUser.user) {
      this.userName = `${currentUser.user.nombre} ${currentUser.user.apellido}`;
      this.userMinisterio = currentUser.user.ministerio;
      
      // Normalizar el ministerio para facilitar las comparaciones
      const ministerioLower = this.userMinisterio.toLowerCase();
      this.isMultimedia = ministerioLower.includes('multimedia');
      this.isAdoracion = ministerioLower.includes('adoración') || ministerioLower.includes('adoracion');
      
      console.log('Ministerio del usuario:', this.userMinisterio);
      console.log('isMultimedia:', this.isMultimedia);
      console.log('isAdoracion:', this.isAdoracion);
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}