import {Component, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AnnessoService} from '../../../services/annesso.service';
import {AnnessoModel} from '../../../models/annesso.model';

import {NgForOf} from '@angular/common';

import {ImmobileModel} from '../../../models/immobile.model';
import {ImmobileDialogComponent} from '../../immobli/immobile-dialog/immobile-dialog.component';
import { RouterLink, RouterOutlet} from '@angular/router';
import {AnnessiUpdateFormComponent} from '../annessi-update-form/annessi-update-form.component';
import {Subscription} from 'rxjs';




@Component({
  selector: 'app-annessiTable',
  imports: [

    NgForOf,

    ImmobileDialogComponent,
    RouterLink,
    RouterOutlet,
    AnnessiUpdateFormComponent
  ],
  templateUrl: './annessi.component.html',
  styleUrl: './annessi.component.css'
})
export class AnnessiComponent implements OnInit,OnDestroy {

  private annessiService = inject(AnnessoService);
  // listaAnnessi = this.annessiService.listaAnnessi$;
  listaAnnessi?: AnnessoModel[];
  selectedAnnesso!: AnnessoModel;
private subscription:Subscription = new Subscription()
  @ViewChild(ImmobileDialogComponent) dialogComponent!: ImmobileDialogComponent;
  @ViewChild(AnnessiUpdateFormComponent) dialogUpdateFormAnnessi!: AnnessiUpdateFormComponent;

  ngOnInit(): void {
    this.subscription.add(
      this.annessiService.getListaAnnessi$().subscribe({
        next:(result:AnnessoModel[])=> { this.listaAnnessi = result;},
      })

    );
    this.annessiService.getAllAnnessi().subscribe()

  }

  openDialogImmobile(immobile: ImmobileModel) {
    this.dialogComponent.listaImmobili = immobile;
    this.dialogComponent.openDialog();
  }

  opendialogUpdate(annesso: AnnessoModel) {
    this.selectedAnnesso = annesso;
    this.dialogUpdateFormAnnessi.openDialog();
  }
deleteAnnesso(annessoId: number) {
    this.annessiService.deleteAnnesso(annessoId).subscribe({
      next: (data) => {
        console.log('annesso eliminato: ', data);
        this.annessiService.getAllAnnessi().subscribe()

      }
    })

}

  ngOnDestroy(): void {
    if( this.subscription){
      this.subscription.unsubscribe();
    }
  }

}
