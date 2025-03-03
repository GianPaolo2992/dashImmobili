import { Component, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AnnessoService} from '../../../services/annesso.service';
import {AnnessoModel} from '../../../models/annesso.model';

import { NgForOf, NgIf} from '@angular/common';

import {ImmobileModel} from '../../../models/immobile.model';
import {ImmobileDialogComponent} from '../../immobli/immobile-dialog/immobile-dialog.component';
import { RouterLink, RouterOutlet} from '@angular/router';
import {AnnessiUpdateFormComponent} from '../annessi-update-form/annessi-update-form.component';
// import {debounceTime, distinctUntilChanged, fromEvent, map, Subscription} from 'rxjs';
  import {debounceTime, Subscription, switchMap} from 'rxjs';
import {SquareMeterPipe} from '../../../pipes/square-meter.pipe';
import {FormControl, ReactiveFormsModule} from '@angular/forms';




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
  ],
  templateUrl: './annessi.component.html',
  styleUrl: './annessi.component.css'
})
export class AnnessiComponent implements OnInit,OnDestroy {

  private annessiService = inject(AnnessoService);
  // listaAnnessi = this.annessiService.listaAnnessi$;
  listaAnnessi?: AnnessoModel[];
  selectedAnnesso?: AnnessoModel;
private subscription:Subscription = new Subscription()
  @ViewChild(ImmobileDialogComponent) dialogComponent!: ImmobileDialogComponent;
  @ViewChild(AnnessiUpdateFormComponent) dialogUpdateFormAnnessi!: AnnessiUpdateFormComponent;
  // @ViewChild('searchInput', { static: false }) searchInput?: ElementRef;
  // results: AnnessoModel[] = [];
  errorMessage: string = '';
searchInput = new FormControl('');

  // ngOnInit(): void {
  //   this.subscription.add(
  //     this.annessiService.getListaAnnessi$().subscribe({
  //       next:(result:AnnessoModel[])=> { this.listaAnnessi = result;},
  //     })
  //
  //   );
  //   this.annessiService.getAllAnnessi().subscribe()
  //
  // }
  ngOnInit(): void {
    this.subscription.add(
      this.annessiService.getListaAnnessi$().subscribe({
        next: (result: AnnessoModel[]) => {
          this.listaAnnessi = result;
        },
        error: err => this.errorMessage = err
      })
    );
    this.annessiService.getAllAnnessi().subscribe()
    this.searchInput.valueChanges.pipe(debounceTime(200), switchMap(text=>this.annessiService.searchAnnessi(text||''))).subscribe(searchResult => this.listaAnnessi = searchResult);

  }

  // ngAfterViewInit(): void {
  //   fromEvent<Event>(this.searchInput?.nativeElement, 'input').pipe(
  //     map((event: Event) => (event.target as HTMLInputElement).value),
  //     debounceTime(300), // Debounce per limitare le richieste
  //     distinctUntilChanged()
  //   ).subscribe(keyword => {
  //     this.searchAnnessi(keyword);
  //   });
  // }


    // searchAnnessi(keyword: string): void {
  //   if (keyword) {
  //     this.annessiService.searchAnnessi(keyword).subscribe(
  //       (data: AnnessoModel[]) => {
  //         this.listaAnnessi = data;
  //         this.errorMessage = '';
  //       },
  //       error => {
  //         this.listaAnnessi = [];
  //         this.errorMessage = error;
  //       }
  //     );
  //   } else {
  //     // Se il campo di ricerca è vuoto, ricarica i dati originali
  //     this.annessiService.getListaAnnessi$().subscribe({
  //       next: (result: AnnessoModel[]) => {
  //         this.listaAnnessi = result;
  //         this.errorMessage = '';
  //       },
  //       error: err => this.errorMessage = err
  //     });
  //   }
  // }

  openDialogImmobile(immobile: ImmobileModel) {
    this.dialogComponent.listaImmobili = immobile;
    this.dialogComponent.openDialog();
  }

  opendialogUpdate(annesso: AnnessoModel) {
    this.selectAnnesso(annesso)
    this.dialogUpdateFormAnnessi.openDialog();
  }
  selectAnnesso(annesso: AnnessoModel) {
    this.selectedAnnesso = annesso;

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
