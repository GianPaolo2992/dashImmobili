import { Component } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {NgStyle} from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    NgStyle
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  credentials = {
    username: '',
    password: ''
  };

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    this.authService.login(this.credentials).subscribe({
      next: (token) => {
        this.authService.saveToken(token);
        alert('Login effettuato!');
        this.router.navigate(['/immobiliTable']); // Redirigi agli immobili
      },
      error: err => {
        alert('Credenziali non valide');
      }
    });
  }
}
