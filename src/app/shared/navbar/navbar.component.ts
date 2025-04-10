import { Component, Input, ViewEncapsulation, OnInit } from '@angular/core';
import { Router, NavigationEnd, Event as RouterEvent } from '@angular/router';
import { Location } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  encapsulation: ViewEncapsulation.None, // Esto es importante para que los estilos no estén encapsulados
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    RouterModule
  ]
})
export class NavbarComponent implements OnInit {
  @Input() title: string = 'Portal Iglesia';
  @Input() showBackButton: boolean = false;
  
  isLoggedIn: boolean = false;
  userName: string = '';
  currentRoute: string = '';
  isAuthPage: boolean = false;
  
  // Mapeo de rutas a títulos
  routeTitles: { [key: string]: string } = {
    '/dashboard': 'Dashboard',
    '/adoracion/buscar-canciones': 'Buscar Canciones',
    '/adoracion/crear-repertorio': 'Crear Repertorio',
    '/multimedia/listar-repertorios': 'Repertorios Pendientes',
    '/multimedia/editar-diapositivas': 'Editor de Diapositivas',
    '/auth/login': 'Iniciar Sesión',
    '/auth/register': 'Registro'
  };
  
  constructor(
    private router: Router,
    private location: Location,
    private authService: AuthService
  ) {
    // Escuchar cambios de ruta para actualizar el título y la información del usuario
    this.router.events.pipe(
      filter((event: RouterEvent): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.updateCurrentRoute(event.urlAfterRedirects);
      this.updateUserInfo();
    });
  }
  
  ngOnInit(): void {
    this.updateCurrentRoute(this.router.url);
    this.updateUserInfo();
    
    // Verificar inmediatamente si estamos en una página de autenticación
    this.isAuthPage = this.router.url.includes('/auth/');
    
    // Suscribirse a los cambios de ruta para detectar páginas de autenticación
    this.router.events.pipe(
      filter((event: RouterEvent): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.isAuthPage = event.urlAfterRedirects.includes('/auth/');
      this.updateCurrentRoute(event.urlAfterRedirects);
      this.updateUserInfo();
      
      // Forzar la detección de cambios para asegurar que los estilos se apliquen
      // Si estás usando ChangeDetectorRef, puedes descomentar la siguiente línea
      // this.cdr.detectChanges();
    });
  }
  
  updateCurrentRoute(url: string): void {
    this.currentRoute = url;
    
    // Actualizar el título basado en la ruta actual
    for (const route in this.routeTitles) {
      if (url.startsWith(route)) {
        this.title = this.routeTitles[route];
        break;
      }
    }
    
    // Determinar si mostrar el botón de retroceso
    this.showBackButton = url !== '/dashboard' && url !== '/auth/login';
  }
  
  updateUserInfo(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      // Obtener el usuario actual directamente del BehaviorSubject
      const currentUser = this.authService.currentUserValue;
      if (currentUser && currentUser.user) {
        this.userName = `${currentUser.user.nombre} ${currentUser.user.apellido}`;
      } else {
        this.userName = '';
      }
    } else {
      this.userName = '';
    }
  }
  
  goBack(): void {
    this.location.back();
  }
  
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
