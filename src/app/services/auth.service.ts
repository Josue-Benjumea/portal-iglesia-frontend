import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    
    let userData = null;
    if (this.isBrowser) {
      userData = JSON.parse(localStorage.getItem('currentUser') || 'null');
    }
    
    this.currentUserSubject = new BehaviorSubject<any>(userData);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  register(userData: any): Observable<any> {
    // Ensure all fields are included and properly formatted
    const registrationData = {
      nombre: userData.nombre || '',
      apellido: userData.apellido || '',
      edad: userData.edad ? Number(userData.edad) : 0,
      cedula: userData.cedula || '',
      email: userData.email || '',
      password: userData.password || '',
      ministerio: userData.ministerio || ''
    };
    
    console.log('Sending registration data:', registrationData);
    return this.http.post(`${this.apiUrl}/auth/register`, registrationData);
  }

  login(cedula: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, { cedula, password })
      .pipe(map(response => {
        // Almacenar detalles del usuario y token JWT en localStorage
        if (this.isBrowser) {
          localStorage.setItem('currentUser', JSON.stringify(response));
        }
        this.currentUserSubject.next(response);
        return response;
      }));
  }

  logout(): void {
    // Eliminar usuario del localStorage
    if (this.isBrowser) {
      localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.currentUserValue;
  }

  getUserMinisterio(): string {
    const currentUser = this.currentUserValue;
    return currentUser && currentUser.user ? currentUser.user.ministerio : '';
  }

  getToken(): string {
    const currentUser = this.currentUserValue;
    return currentUser && currentUser.token ? currentUser.token : '';
  }
}
