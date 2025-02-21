import {Component, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ProprietarioService} from '../../../services/proprietario.service';
import {ProprietarioModel} from '../../../models/proprietario.model';
import {ImmobileDialogComponent} from '../../immobli/immobile-dialog/immobile-dialog.component';
import {ImmobileModel} from '../../../models/immobile.model';
import {RouterLink} from '@angular/router';
import {AnnessiUpdateFormComponent} from '../../annessi/annessi-update-form/annessi-update-form.component';
import {ProprietarioUpdateFormComponent} from '../proprietario-update-form/proprietario-update-form.component';
import {Subscription} from 'rxjs';


@Component({
  selector: 'app-proprietariTable',
  imports: [
    ImmobileDialogComponent,
    RouterLink,
    ProprietarioUpdateFormComponent,

  ],
  templateUrl: './proprietari.component.html',
  styleUrl: './proprietari.component.css'
})


export class ProprietariComponent implements OnInit, OnDestroy {

  private proprietarioService = inject(ProprietarioService);
  private subscription: Subscription = new Subscription();

  listProp?: ProprietarioModel[];
  selectedProp!: ProprietarioModel;


  @ViewChild(ImmobileDialogComponent) modalComponent!: ImmobileDialogComponent;
  @ViewChild(ProprietarioUpdateFormComponent) dialogUpdateForm!: ProprietarioUpdateFormComponent;


  ngOnInit(): void {
    this.subscription.add(
      this.proprietarioService.getListaProprietari$().subscribe({
          next: props => {
            this.listProp = props
          },
          error: error => {
            console.log(error);
          }
        }
      )
    )
    this.proprietarioService.getAllProprietari().subscribe();


  }

  openDialogImmobili(Immobili: ImmobileModel[]) {
    this.modalComponent.listaImmobili = Immobili;
    this.modalComponent.openDialog();
  }

  openDialogUpdate(proprietario: ProprietarioModel) {
    this.selectedProp = proprietario;
    this.dialogUpdateForm.openDialog();
  }

  deleteAnnesso(id: number) {
    this.proprietarioService.deleteProp(id).subscribe({
      next: (result) => {
        console.log('proprietario elinìminato:' + result);
        this.proprietarioService.getAllProprietari().subscribe()
      }
    })
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
