import { Component, inject, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ProprietarioService } from './services/proprietario.service';
import { ProprietarioModel } from './models/proprietario.model';
import {NavbarComponent} from './components/navbar/navbar.component';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HttpClientModule, NavbarComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],

})
export class AppComponent implements OnInit {
  private proprietarioService = inject(ProprietarioService);
  listProp?: ProprietarioModel[];

  ngOnInit(): void {
    this.proprietarioService.getAllProprietari().subscribe(data => {
      this.listProp = data;
      console.log(this.listProp);
    });

  }
}
