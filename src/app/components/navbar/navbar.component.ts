import {Component, inject} from '@angular/core';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {NgClass, NgIf} from '@angular/common';
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap'; // Importa il modulo di Bootstrap

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, NgIf, NgClass,],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isNavbarCollapsed = true; // Con ngbCollapse, lo stato iniziale è "chiuso"

  constructor(public authService: AuthService, private router: Router) {}

  logout(): void {
    this.authService.logout();
    this.isNavbarCollapsed = true; // Chiudi la navbar dopo il logout
    this.router.navigate(['/login']);
  }

}
