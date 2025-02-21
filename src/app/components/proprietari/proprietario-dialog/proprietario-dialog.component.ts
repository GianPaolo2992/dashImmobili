import {Component, Input, ViewChild} from '@angular/core';
import {ProprietarioModel} from '../../../models/proprietario.model';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-proprietario-dialog',
  imports: [],
  templateUrl: './proprietario-dialog.component.html',
  styleUrl: './proprietario-dialog.component.css'
})
export class ProprietarioDialogComponent {
  @ViewChild('dialog') dialog: any
  @Input() proprietario?: ProprietarioModel | null;


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
