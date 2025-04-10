import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CancionService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  buscarCanciones(query: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/canciones/buscar`, {
      params: { q: query }
    });
  }

  obtenerLetra(artista: string, titulo: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/canciones/letra`, {
      params: { artista, titulo }
    });
  }
  
  // Add the missing method
  actualizarCancion(cancionId: number, letra: string, diapositivas: any[], recursos?: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/canciones/${cancionId}/letra`, {
      letra,
      diapositivas,
      recursos
    });
  }

  subirImagenFondo(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', file);
    
    return this.http.post(`${this.apiUrl}/canciones/upload-background`, formData);
  }
}
