import {Routes} from '@angular/router';
import {ProprietariComponent} from './components/proprietari/proprietariTable/proprietari.component';
import {HomeComponent} from './components/home/home.component';
import {ImmobiliComponent} from './components/immobli/immobiliTable/immobili.component';
import {AnnessiComponent} from './components/annessi/annessiTable/annessi.component';
import {ImmobiliFormComponent} from './components/immobli/immobili-form/immobili-form.component';
import {ProprietariFormComponent} from './components/proprietari/proprietari-form/proprietari-form.component';
import {AnnessiFormComponent} from './components/annessi/annessi-form/annessi-form.component';
import {RegisterComponent} from './components/register/register.component';
import {LoginComponent} from './components/login/login.component';
import {AuthGuard} from './Guard/auth.guard';

export const routes: Routes = [

  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},

  {path: 'immobiliTable', component: ImmobiliComponent, children: []},
  {path: 'immobiliForm', component: ImmobiliFormComponent, canActivate: [AuthGuard]},

  {path: 'proprietariTable', component: ProprietariComponent, children: []},
  {path: 'proprietariForm', component: ProprietariFormComponent , canActivate: [AuthGuard]},

  {path: 'annessiTable', component: AnnessiComponent, children: []},
  {path: 'annessiForm', component: AnnessiFormComponent, canActivate: [AuthGuard]},

  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
];
