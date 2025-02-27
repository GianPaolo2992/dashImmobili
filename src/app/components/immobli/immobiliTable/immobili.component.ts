import {Component, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ImmobileModel} from '../../../models/immobile.model';
import {ImmobileService} from '../../../services/immobile.service';
import {CurrencyPipe, NgForOf} from '@angular/common';
import {ProprietarioDialogComponent} from '../../proprietari/proprietario-dialog/proprietario-dialog.component';
import {ProprietarioModel} from '../../../models/proprietario.model';
import {AnnessoModel} from '../../../models/annesso.model';
import {AnnessoDialogComponent} from '../../annessi/annesso-dialog/annesso-dialog.component';
import {RouterLink} from '@angular/router';
import {Subscription} from 'rxjs';
import {ImmobileUpdateFormComponent} from '../immobile-update-form/immobile-update-form.component';
import {SquareMeterPipe} from '../../../pipes/square-meter.pipe';
import {AnnessoService} from '../../../services/annesso.service';
import {ProprietarioService} from '../../../services/proprietario.service';

@Component({
  selector: 'app-immobiliTable',
  imports: [
    NgForOf,
    ProprietarioDialogComponent,
    AnnessoDialogComponent,
    RouterLink,
    ImmobileUpdateFormComponent,
    CurrencyPipe,
    SquareMeterPipe
  ],
  templateUrl: './immobili.component.html',
  styleUrl: './immobili.component.css'
})
export class ImmobiliComponent implements OnInit, OnDestroy{
  private immobileService = inject(ImmobileService);
  private proprietarioService = inject(ProprietarioService);
  private annessoService = inject(AnnessoService);
  private subscription: Subscription = new Subscription();
  @ViewChild(ProprietarioDialogComponent) dialogPropComponent!: ProprietarioDialogComponent;
  @ViewChild(AnnessoDialogComponent) dialogAnnesiComponent!: AnnessoDialogComponent;
  @ViewChild(ImmobileUpdateFormComponent) dialogUpdateComponent!: ImmobileUpdateFormComponent;



  listaImmobili?: ImmobileModel[];
  selectedImmobile?: ImmobileModel;


  ngOnInit() {
    this.subscription.add(
      this.immobileService.getListaImmobili$().subscribe({
        next:( data) => { this.listaImmobili = data},
        error: error => {
          console.log(error);
        }

      })
    );
    this.refreshData()
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
  openDialogAnnessi(listaAnnessi:AnnessoModel[]){
    this.dialogAnnesiComponent.listaAnnessi = listaAnnessi
    this.dialogAnnesiComponent.openDialog()
  }
  openDialogUpdate(immobile:ImmobileModel){
    this.selectedImmobile = immobile;
    this.dialogUpdateComponent.openDialog();
  }
  selectImmobile(immobile: ImmobileModel) {
    this.selectedImmobile = immobile;
  }
  deleteimmobile(immobileId: number){
    this.immobileService.deleteImmobile(immobileId).subscribe({
      next:(result) => {
        console.log('immobile deletato:' + JSON.stringify(result));
        this.refreshData()
      },
      error: error => {
        console.log(error);
      }
    })
}
  ngOnDestroy(): void {
    if(this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
