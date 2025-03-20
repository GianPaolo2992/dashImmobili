import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {jwtDecode} from 'jwt-decode';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
urlRegister = 'http://localhost:8080/auth/register';
urlLogin = 'http://localhost:8080/auth/login';


  // Metodo per la registrazione
  register(user: any): Observable<any> {
    return this.http.post(this.urlRegister, user)
  }
  private logoutTimer: any;

  constructor(private http: HttpClient, private router: Router) {}

  // Metodo per il login
  login(credentials: any): Observable<any> {
    return this.http.post(this.urlLogin, credentials, { responseType: 'text' }).pipe(
      tap((response: any) => {
        this.saveToken(response.idToken);
        this.setLogoutTimer(response.expiresIn);
      })
    );
  }

  // Salva il token e imposta il timer di logout
  saveToken(token: string): void {
    localStorage.setItem('jwtToken', token);
    const expirationTime = this.getTokenExpiration(token);
    if (expirationTime) {
      this.setLogoutTimer(expirationTime);
    }
  }

  // Recupera il token
  getToken(): string | null {
    return localStorage.getItem('jwtToken');
  }

  // Recupera il tempo di scadenza dal token
  getTokenExpiration(token: string): number | null {
    try {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.exp ? decodedToken.exp * 1000 : null; // Converti in millisecondi
    } catch (error) {
      return null;
    }
  }

  // Imposta un timer per il logout automatico
  setLogoutTimer(expirationTime: number): void {
    const expiresInMs = expirationTime - Date.now();
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
    }
    this.logoutTimer = setTimeout(() => {
      this.logout();
      this.router.navigate(['/login']);
    }, expiresInMs);
  }

  // Metodo per il logout
  logout(): void {
    localStorage.removeItem('jwtToken');
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
    }
  }

  // Controlla se l'utente è loggato (per evitare problemi con il refresh della pagina)
  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    const expirationTime = this.getTokenExpiration(token);
    if (!expirationTime || expirationTime < Date.now()) {
      this.logout();
      return false;
    }
    return true;
  }



}
