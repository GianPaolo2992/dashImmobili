import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
urlRegister = 'http://localhost:8080/auth/register';
urlLogin = 'http://localhost:8080/auth/login';
  constructor(private http: HttpClient) {}

  // Metodo per la registrazione
  register(user: any): Observable<any> {
    return this.http.post(this.urlRegister, user)
  }

  // Metodo per il login
  login(credentials: any): Observable<any> {
    return this.http.post(this.urlLogin, credentials, { responseType: 'text' });
  }

  // Metodo per salvare il token nel localStorage
  saveToken(token: string): void {
    localStorage.setItem('jwtToken', token);
  }

  // Metodo per recuperare il token
  getToken(): string | null {
    return localStorage.getItem('jwtToken');
  }
  isLoggedIn(): boolean {
    // Logica per verificare se l'utente è loggato
    // Ad esempio, controllare la presenza di un token di autenticazione
    return !!localStorage.getItem('jwtToken');
  }

  // Metodo per il logout
  logout(): void {
    localStorage.removeItem('jwtToken');
  }


}
