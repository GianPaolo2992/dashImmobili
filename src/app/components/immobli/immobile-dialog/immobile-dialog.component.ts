import {Component, Input, ViewChild} from '@angular/core';

import {ImmobileModel} from '../../../models/immobile.model';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-immobile-dialog',
  imports: [
    NgForOf,

  ],
  templateUrl: './immobile-dialog.component.html',
  styleUrl: './immobile-dialog.component.css'
})
export class ImmobileDialogComponent {
  @ViewChild('dialog') dialog: any;
  @Input() listaImmobili?: ImmobileModel[] | ImmobileModel;

  protected readonly Array = Array;

  openDialog() {
    const dialogElement = this.dialog.nativeElement;
    dialogElement.showModal();
    setTimeout(() => {
      dialogElement.style.opacity = '1';
      dialogElement.style.transform = 'scale(1)';
    }, 0); // Ritardo di 0 ms per applicare la transizione
  }

  onClose(dialog: any) {
    dialog.style.opacity = '0';
    dialog.style.transform = 'scale(0.7)';
    setTimeout(() => {
      dialog.close();
    }, 500); // Durata della transizione
  }

}




