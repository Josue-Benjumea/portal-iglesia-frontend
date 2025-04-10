import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // Verificar si el usuario está autenticado
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }
    
    // Verificar si la ruta requiere un ministerio específico
    const requiredMinisterio = route.data['ministerio'];
    if (!requiredMinisterio) {
      return true;
    }
    
    // Verificar si el usuario pertenece al ministerio requerido
    const userMinisterio = this.authService.getUserMinisterio();
    if (userMinisterio === requiredMinisterio) {
      return true;
    }
    
    // Si el usuario no tiene el ministerio requerido, mostrar mensaje y redirigir al dashboard
    this.snackBar.open(`Acceso denegado. Esta sección es solo para miembros del ${requiredMinisterio}.`, 'Cerrar', {
      duration: 5000
    });
    this.router.navigate(['/dashboard']);
    return false;
  }
}
