import { Component } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf, NgStyle} from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    NgStyle,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  LoginForm: FormGroup = new FormGroup({
    username : new FormControl("", [Validators.required]),
    password : new FormControl("", [Validators.required]),
  }) ;
  ValidateForm = true;
  // credentials = {
  //   username: '',
  //   password: ''
  // };

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    // this.authService.login(this.credentials).subscribe({
    if (!this.LoginForm.valid) {
      this.ValidateForm = false;
      return;
    }
    this.authService.login(this.LoginForm.value).subscribe({
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
