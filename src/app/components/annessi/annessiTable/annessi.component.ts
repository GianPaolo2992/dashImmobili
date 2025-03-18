import {Component, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AnnessoService} from '../../../services/annesso.service';
import {AnnessoModel} from '../../../models/annesso.model';

import {NgClass, NgForOf, NgIf} from '@angular/common';

import {ImmobileModel} from '../../../models/immobile.model';
import {ImmobileDialogComponent} from '../../immobli/immobile-dialog/immobile-dialog.component';
import {RouterLink, RouterOutlet} from '@angular/router';
import {AnnessiUpdateFormComponent} from '../annessi-update-form/annessi-update-form.component';
import {debounceTime, Subscription, switchMap} from 'rxjs';
import {SquareMeterPipe} from '../../../pipes/square-meter.pipe';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination';
import {AuthService} from '../../../services/auth.service';
import {combineLatest} from 'rxjs';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';


@Component({
  selector: 'app-annessiTable',
  imports: [

    NgForOf,

    ImmobileDialogComponent,
    RouterLink,
    RouterOutlet,
    AnnessiUpdateFormComponent,
    SquareMeterPipe,
    NgIf,
    ReactiveFormsModule,
    NgxPaginationModule,
    NgClass,
  ],
  templateUrl: './annessi.component.html',
  styleUrl: './annessi.component.css'
})
export class AnnessiComponent implements OnInit, OnDestroy {

  private annessiService = inject(AnnessoService);
  private authService = inject(AuthService);
  private breakpointObserver = inject(BreakpointObserver);
  // listaAnnessi = this.annessiService.listaAnnessi$;
  listaAnnessi?: AnnessoModel[]; //getall
  selectedAnnesso?: AnnessoModel;//annesso selezionato
  private subscription: Subscription = new Subscription()
  @ViewChild(ImmobileDialogComponent) dialogComponent!: ImmobileDialogComponent;
  @ViewChild(AnnessiUpdateFormComponent) dialogUpdateFormAnnessi!: AnnessiUpdateFormComponent;
  // @ViewChild('searchInput', { static: false }) searchInput?: ElementRef;
  // results: AnnessoModel[] = [];
  errorMessage: string = '';
  searchInput = new FormControl('');//input della search
  currentPage: number = 1;//paginator

  isMobile= false;

  ngOnInit(): void {
    // this.subscription.add(
    //   this.annessiService.getListaAnnessi$().subscribe({
    //     next: (result: AnnessoModel[]) => {
    //       this.listaAnnessi = result;
    //     },
    //     error: err => this.errorMessage = err
    //   })
    // );

    this.subscription.add(
      combineLatest([
        this.annessiService.getListaAnnessi$(), // Chiamata API
        this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.Handset]) // Controllo viewport
      ]).subscribe(([annessi, breakpoint]) => {
        this.listaAnnessi = annessi;
        this.isMobile = breakpoint.matches;
      })
    );
    this.annessiService.getAllAnnessi().subscribe()
    this.searchInput.valueChanges
      .pipe(
        debounceTime(200),
        switchMap(text => this.annessiService.searchAnnessi(text || ''))
      )
      .subscribe(searchResult => this.listaAnnessi = searchResult);

  }


  openDialogImmobile(immobile: ImmobileModel) {
    this.dialogComponent.listaImmobili = immobile;
    this.dialogComponent.openDialog();
  }

  opendialogUpdate(annesso: AnnessoModel) {
    if (!this.authService.isLoggedIn()) {
      alert('Devi essere loggato per eseguire questa operazione.');
      return;
    }
    this.selectAnnesso(annesso)
    this.dialogUpdateFormAnnessi.openDialog();
  }

  selectAnnesso(annesso: AnnessoModel) {
    this.selectedAnnesso = annesso;

  }

  deleteAnnesso(annessoId: number) {
    if (!this.authService.isLoggedIn()) {
      alert('Devi essere loggato per eseguire questa operazione.');
      return;
    }
    this.annessiService.deleteAnnesso(annessoId).subscribe({
      next: (data) => {
        console.log('annesso eliminato: ', data);
        this.annessiService.getAllAnnessi().subscribe()

      }
    })

  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
