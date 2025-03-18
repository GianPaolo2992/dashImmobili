import {Component, inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ImmobileModel} from '../../../models/immobile.model';
import {ImmobileService} from '../../../services/immobile.service';
import {CurrencyPipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {ProprietarioDialogComponent} from '../../proprietari/proprietario-dialog/proprietario-dialog.component';
import {ProprietarioModel} from '../../../models/proprietario.model';
import {AnnessoModel} from '../../../models/annesso.model';
import {AnnessoDialogComponent} from '../../annessi/annesso-dialog/annesso-dialog.component';
import {RouterLink} from '@angular/router';
import {combineLatest, debounceTime, Subscription, switchMap} from 'rxjs';
import {ImmobileUpdateFormComponent} from '../immobile-update-form/immobile-update-form.component';
import {SquareMeterPipe} from '../../../pipes/square-meter.pipe';
import {AnnessoService} from '../../../services/annesso.service';
import {ProprietarioService} from '../../../services/proprietario.service';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination';
import {AuthService} from '../../../services/auth.service';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';


@Component({
  selector: 'app-immobiliTable',
  imports: [
    NgForOf,
    ProprietarioDialogComponent,
    AnnessoDialogComponent,
    RouterLink,
    ImmobileUpdateFormComponent,
    CurrencyPipe,
    SquareMeterPipe,
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    NgxPaginationModule,
    NgClass
  ],
  templateUrl: './immobili.component.html',
  styleUrl: './immobili.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class ImmobiliComponent implements OnInit, OnDestroy {
  private immobileService = inject(ImmobileService);
  private proprietarioService = inject(ProprietarioService);
  private annessoService = inject(AnnessoService);
  private authService = inject(AuthService);
  private breakpointObserver = inject(BreakpointObserver);
  private subscription: Subscription = new Subscription();
  @ViewChild(ProprietarioDialogComponent) dialogPropComponent!: ProprietarioDialogComponent;
  @ViewChild(AnnessoDialogComponent) dialogAnnesiComponent!: AnnessoDialogComponent;
  @ViewChild(ImmobileUpdateFormComponent) dialogUpdateComponent!: ImmobileUpdateFormComponent;

  currentPage: number = 1;
  listaImmobili?: ImmobileModel[];
  selectedImmobile?: ImmobileModel;
  immobileDeleted?: ImmobileModel;
  searchInput = new FormControl('');
  errorMessage = '';

  isMobile = false;

  ngOnInit() {

    this.subscription.add(
      combineLatest([
        this.immobileService.getListaImmobili$(),  // Chiamata API
        this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.Handset]) // Controllo viewport
      ]).subscribe(([immobili, breakpoint]) => {
        this.listaImmobili = immobili;
        this.isMobile = breakpoint.matches;
      })
    );


    this.refreshData();
    this.searchInput.valueChanges
      .pipe(
        debounceTime(200),
        switchMap(text => this.immobileService.searchImmobile(text || ''))
      )
      .subscribe(searchResult => this.listaImmobili = searchResult);
  }

  refreshData() {
    this.immobileService.getAllImmobili().subscribe();
    this.proprietarioService.getAllProprietari().subscribe();
    this.annessoService.getAllAnnessi().subscribe();
  }


  openDialogProp(proprietario: ProprietarioModel | null) {
    this.dialogPropComponent.proprietario = proprietario;
    this.dialogPropComponent.openDialog();
  }

  openDialogAnnessi(listaAnnessi: AnnessoModel[]) {
    this.dialogAnnesiComponent.listaAnnessi = listaAnnessi
    this.dialogAnnesiComponent.openDialog()
  }

  openDialogUpdate(immobile: ImmobileModel) {
    if (!this.authService.isLoggedIn()) {
      alert('Devi essere loggato per eseguire questa operazione.');
      return;
    }
    this.selectedImmobile = immobile;
    console.log(this.selectedImmobile);
    this.dialogUpdateComponent.openDialog();
  }

  selectImmobile(immobile: ImmobileModel) {
    this.selectedImmobile = immobile;
  }

  selectDeleteImmobile(immobile: ImmobileModel) {
    this.immobileDeleted = immobile;
  }

  deleteimmobile(immobileId: number) {

    if (!this.authService.isLoggedIn()) {
      alert('Devi essere loggato per eseguire questa operazione.');
      return;
    }
    this.immobileService.deleteImmobile(immobileId).subscribe({
      next: (result) => {
        console.log('immobile deletato:' + JSON.stringify(result));
        this.refreshData()
      },
      error: error => {
        console.log(error);
      }
    })
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
