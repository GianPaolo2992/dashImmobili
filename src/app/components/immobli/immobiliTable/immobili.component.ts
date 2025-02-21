import {Component, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ImmobileModel} from '../../../models/immobile.model';
import {ImmobileService} from '../../../services/immobile.service';
import {NgForOf} from '@angular/common';
import {ProprietarioDialogComponent} from '../../proprietari/proprietario-dialog/proprietario-dialog.component';
import {ProprietarioModel} from '../../../models/proprietario.model';
import {AnnessoModel} from '../../../models/annesso.model';
import {AnnessoDialogComponent} from '../../annessi/annesso-dialog/annesso-dialog.component';
import {RouterLink} from '@angular/router';
import {Subscription} from 'rxjs';
import {ImmobileUpdateFormComponent} from '../immobile-update-form/immobile-update-form.component';

@Component({
  selector: 'app-immobiliTable',
  imports: [
    NgForOf,
    ProprietarioDialogComponent,
    AnnessoDialogComponent,
    RouterLink,
    ImmobileUpdateFormComponent
  ],
  templateUrl: './immobili.component.html',
  styleUrl: './immobili.component.css'
})
export class ImmobiliComponent implements OnInit, OnDestroy{
  private immobileService = inject(ImmobileService);
  private subscription: Subscription = new Subscription();
  @ViewChild(ProprietarioDialogComponent) dialogPropComponent!: ProprietarioDialogComponent;
  @ViewChild(AnnessoDialogComponent) dialogAnnesiComponent!: AnnessoDialogComponent;
  @ViewChild(ImmobileUpdateFormComponent) dialogUpdateComponent!: ImmobileUpdateFormComponent;


  listaImmobili?: ImmobileModel[]
  selectedImmobile?: ImmobileModel;

 // ngOnInit() {
 //  this.immobileService.getAllImmobili().subscribe(data => this.listaImmobili = data);
 // }
  ngOnInit() {
    this.subscription.add(
      this.immobileService.getListaImmobili$().subscribe({
        next:( data) => { this.listaImmobili = data},
        error: error => {
          console.log(error);
        }

      })
    );
    this.immobileService.getAllImmobili().subscribe();
  }

  openDialogProp(proprietario: ProprietarioModel | null) {
   this.dialogPropComponent.proprietario = proprietario;
   this.dialogPropComponent.openDialog();
 }
  openDialogAnnessi(listaAnnessi:AnnessoModel[]){
    this.dialogAnnesiComponent.listaAnnessi = listaAnnessi
    this.dialogAnnesiComponent.openDialog()
  }
  openDialogUpdate(immobile:ImmobileModel){
    this.selectedImmobile = immobile;
    this.dialogUpdateComponent.openDialog();
  }
  deleteAnnesso(immobileId: number){
    console.log('immobile deletato:' + immobileId);
}
  ngOnDestroy(): void {
    if(this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
