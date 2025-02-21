import {Component, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AnnessoModel} from '../../../models/annesso.model';
import {ImmobileService} from '../../../services/immobile.service';

import {ImmobileModel} from '../../../models/immobile.model';
import {AnnessoService} from '../../../services/annesso.service';
import {RouterLink, } from '@angular/router';
import {BehaviorSubject, Subscription} from 'rxjs';

@Component({
  selector: 'app-annessi-form',
  imports: [
    NgIf,
    ReactiveFormsModule,
    NgForOf,
    RouterLink,


  ],
  templateUrl: './annessi-form.component.html',
  styleUrl: './annessi-form.component.css'
})
export class AnnessiFormComponent implements OnInit, OnDestroy {
annessiForm!: FormGroup;

  listaImmobili?:ImmobileModel[] ;
  // listaImmobili$ = new BehaviorSubject<ImmobileModel[]>([]);

  private subscription = new Subscription();


  private fb = inject(FormBuilder)
  private immobileService = inject(ImmobileService)
  private annessoService = inject(AnnessoService)
  @ViewChild('dialog') dialog: any;

  // private allImmobiliSubscription?: Subscription

constructor() {}

  ngOnInit() {
    this.subscription.add(
      this.immobileService.getListaImmobili$().subscribe(data => {
        this.listaImmobili = data;
      })
    );
    this.immobileService.getAllImmobili().subscribe();


    this.annessiForm = this.fb.group({
      tipo:['', Validators.required],
      superficie:[0,[Validators.required,Validators.minLength(0)]],
      immobileDTO:[null]
    })
  }

  serializeImmobile(immobile: ImmobileModel): string {
    return JSON.stringify(immobile);
  }

onSubmit() {
  if (this.annessiForm.valid) {
    const annesso:AnnessoModel = {
      tipo: this.annessiForm.get('tipo')?.value,
      superficie: this.annessiForm.get('superficie')?.value,
      immobileDTO: JSON.parse(this.annessiForm.get('immobileDTO')?.value),
    }

    this.annessoService.insertAnnesso(annesso).subscribe(  {
      next:(data) =>{
        console.log('success' + data)
        this.ngOnInit();
      },
      error:(error) => {
        console.log('error' + error)
      }
    })
    // console.log('form ' + this.annessiForm.value);
    // console.log('form ' + JSON.stringify(annesso));
    // console.log('immobile ' + JSON.stringify(annesso.immobileDTO));
  } else {
    console.log('Form non valido');
  }
}

ngOnDestroy(): void {
  this.subscription.unsubscribe();
}

//   openDialog() {
//     const dialogElement = this.dialog.nativeElement;
//     dialogElement.showModal();
//     setTimeout(() => {
//       dialogElement.style.opacity = '1';
//       dialogElement.style.transform = 'scale(1)';
//     }, 0); // Ritardo di 0 ms per applicare la transizione
//   }
//
//   onClose(dialog: any) {
//     dialog.style.opacity = '0';
//     dialog.style.transform = 'scale(0.7)';
//     setTimeout(() => {
//       dialog.close();
//     }, 500); // Durata della transizione
//   }

}
