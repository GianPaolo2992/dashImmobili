import {Component, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ProprietarioService} from '../../../services/proprietario.service';
import {ProprietarioModel} from '../../../models/proprietario.model';
import {ImmobileDialogComponent} from '../../immobli/immobile-dialog/immobile-dialog.component';
import {ImmobileModel} from '../../../models/immobile.model';
import {RouterLink} from '@angular/router';
import {ProprietarioUpdateFormComponent} from '../proprietario-update-form/proprietario-update-form.component';
import {debounceTime, Subscription, switchMap} from 'rxjs';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import {NgxPaginationModule} from 'ngx-pagination';
import {AuthService} from '../../../services/auth.service';



@Component({
  selector: 'app-proprietariTable',
  imports: [
    ImmobileDialogComponent,
    RouterLink,
    ProprietarioUpdateFormComponent,
    NgIf,
    ReactiveFormsModule,
    NgForOf,
    NgxPaginationModule

  ],
  templateUrl: './proprietari.component.html',
  styleUrl: './proprietari.component.css'
})




export class ProprietariComponent implements OnInit, OnDestroy {

  private proprietarioService = inject(ProprietarioService);
  private authService = inject(AuthService);
  private subscription: Subscription = new Subscription();

  listProp?: ProprietarioModel[];
  selectedProp?: ProprietarioModel;
  deletedProp?:ProprietarioModel;
  searchInput = new FormControl('');
  errorMessage ='';

  @ViewChild(ImmobileDialogComponent) modalComponent!: ImmobileDialogComponent;
  @ViewChild(ProprietarioUpdateFormComponent) dialogUpdateForm!: ProprietarioUpdateFormComponent;

  currentPage: number = 1;

  ngOnInit(): void {
    this.subscription.add(
      this.proprietarioService.getListaProprietari$().subscribe({
        next: (props: ProprietarioModel[]) => {
          this.listProp = props;
        },
        error: error => this.errorMessage = error
      })
    );
    this.proprietarioService.getAllProprietari().subscribe()
    this.searchInput.valueChanges
      .pipe(
        debounceTime(200),
        switchMap(text => this.proprietarioService.searchProp(text || ''))
      )
      .subscribe(searchResult => this.listProp = searchResult);
  }

  openDialogImmobili(Immobili: ImmobileModel[]) {
    this.modalComponent.listaImmobili = Immobili;
    this.modalComponent.openDialog();
  }

  openDialogUpdate(proprietario: ProprietarioModel) {
    if (!this.authService.isLoggedIn()) {
      alert('Devi essere loggato per eseguire questa operazione.');
      return;
    }
    this.selectedProp = proprietario;
    this.dialogUpdateForm.openDialog();
  }

  selectProp(proprietario: ProprietarioModel) {
    this.selectedProp = proprietario;
  }

  selectDeleteProp(prop: ProprietarioModel){
    this.deletedProp = prop;
  }

  deleteProp(id: number) {
    if (!this.authService.isLoggedIn()) {
      alert('Devi essere loggato per eseguire questa operazione.');
      return;
    }
    this.proprietarioService.deleteProp(id).subscribe({
      next: (result) => {
        console.log('proprietario elinìminato:' + result);
       this.proprietarioService.getAllProprietari().subscribe({
         next: (result) => {
           console.log(result);
         }
       });
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
