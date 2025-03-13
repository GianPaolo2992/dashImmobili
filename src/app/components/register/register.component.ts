import { Component } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {FormsModule} from '@angular/forms';
import {NgStyle} from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [
    FormsModule,
    NgStyle
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  user = {
    username: '',
    email: '',
    password: ''
  };

  constructor(private authService: AuthService,private router: Router) {}

  register(): void {
    this.authService.register(this.user).subscribe({
      next: () => {
        alert('Registrazione completata!');
            // Dopo la registrazione, effettua automaticamente il login
            this.authService.login({
              username: this.user.username,
              password: this.user.password
            }).subscribe({
              next: (token) => {
                this.authService.saveToken(token); // Salva il token nel localStorage
                alert('login effettuati con successo!');
                this.router.navigate(['/immobiliTable']);
              },
              error: err => {
                alert('Errore nel login automatico: ' + err.message);
              }
            });

      },
      error: err => {
        alert('Errore durante la registrazione: ' + err.message);
      }
    });
  }
}
