import {Component, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { NgForOf, NgIf} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AnnessoModel} from '../../../models/annesso.model';
import {ImmobileService} from '../../../services/immobile.service';

import {ImmobileModel} from '../../../models/immobile.model';
import {AnnessoService} from '../../../services/annesso.service';
import {RouterLink, } from '@angular/router';
import { Subscription} from 'rxjs';
import {ANNESSI_OPTIONS, Option} from '../../../constants/options';

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

  private fb = inject(FormBuilder)
  private immobileService = inject(ImmobileService)
  private annessoService = inject(AnnessoService)

  private subscription = new Subscription();

  @ViewChild('dialog') dialog: any;

  annessiForm!: FormGroup;
  listaImmobili?:ImmobileModel[] ;
  annessiOptions: Option[] = ANNESSI_OPTIONS;


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

  } else {
    console.log('Form non valido');
  }
}

ngOnDestroy(): void {
  if(this.subscription) {
    this.subscription.unsubscribe();
  }
}



}
