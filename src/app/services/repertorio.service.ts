import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RepertorioService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  crearRepertorio(fecha: string, canciones: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/repertorios`, {
      fecha_programada: fecha,
      canciones
    });
  }

  obtenerRepertoriosPendientes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/repertorios/pendientes`);
  }

  obtenerCancionesRepertorio(repertorioId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/repertorios/${repertorioId}/canciones`);
  }

  actualizarEstadoRepertorio(repertorioId: number, estado: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/repertorios/${repertorioId}/estado`, { estado });
  }

  actualizarCancion(cancionId: number, letra: string, diapositivas: any[]): Observable<any> {
    return this.http.put(`${this.apiUrl}/canciones/${cancionId}/letra`, {
      letra,
      diapositivas
    });
  }
}
