import {Component} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import {NgIf, NgStyle} from '@angular/common';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [
    FormsModule,
    NgStyle,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  RegisterForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    ]),
    confirmPassword: new FormControl('', [Validators.required])
  }, { validators: this.passwordMatchValidator });


  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const group = control as FormGroup;
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { passwordMismatch: true };
  }
  ValidateForm: boolean = true;
  showPassword: boolean = false;
  showConfirmPass: boolean = false;


  constructor(private authService: AuthService, private router: Router) {

  }
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPass = !this.showConfirmPass;
  }

  register(): void {
    if (!this.RegisterForm!.valid) {
      console.log('form non valido')
      this.ValidateForm = false;
      return
    }


    console.log(this.RegisterForm.value);
    this.authService.register(this.RegisterForm!.value).subscribe({
      next: () => {
        alert('Registrazione completata!');
        // Dopo la registrazione, effettua automaticamente il login
        this.authService.login({


          username: this.RegisterForm?.get('username')?.value,
          password: this.RegisterForm?.get('password')?.value
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
