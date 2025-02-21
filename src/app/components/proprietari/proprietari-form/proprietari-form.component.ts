import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {ProprietarioService} from '../../../services/proprietario.service';
import {ImmobileService} from '../../../services/immobile.service';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { NgForOf, NgIf} from '@angular/common';
import {ImmobileModel} from '../../../models/immobile.model';
import {ProprietarioModel} from '../../../models/proprietario.model';
import {RouterLink} from '@angular/router';
import {BehaviorSubject, Subscription} from 'rxjs';





@Component({
  selector: 'app-proprietari-form',
  imports: [
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './proprietari-form.component.html',
  styleUrl: './proprietari-form.component.css'
})
export class ProprietariFormComponent implements OnInit, OnDestroy {
  private proprietarioService = inject(ProprietarioService);
  private immobileService = inject(ImmobileService);
  private fb =  inject(FormBuilder);

  proprietariForm!: FormGroup;
  listaImmobiliNOProp?: ImmobileModel[];

  listaImmobili$ = new BehaviorSubject<ImmobileModel[]>([]);
  selectedImmobili: ImmobileModel[]=[];


  private subscription = new Subscription();



  ngOnInit(): void {
    this.subscription.add(
      this.immobileService.getListaImmobili$().subscribe({
        next: (data: ImmobileModel[]) => {
          this.listaImmobiliNOProp = data.filter((i: ImmobileModel) => !i.proprietariDTO);
        },
        error: (error) =>{
          console.log(error);
        }
      })
    );
    this.immobileService.getAllImmobili().subscribe();
// this.immobileService.getAllImmobili().subscribe(allimmobili => {
//         this.listaImmobili = allimmobili.filter(immobili => immobili.proprietariDTO === undefined)
//         console.log(this.listaImmobili);
//       })
    this.proprietariForm = this.fb.group({
      nome: ['', Validators.required],
      cognome: ['', Validators.required],
      listaImmobiliDTO: [],
    })



    console.log(this.listaImmobili$);
  }

  serializeImmobile(immobile: ImmobileModel){
    return JSON.stringify(immobile);
  }


  onSubmit() {
    const proprietario: ProprietarioModel = {
      nome: this.proprietariForm.get('nome')?.value,
      cognome: this.proprietariForm.get('cognome')?.value,
      // listaImmobiliDTO: JSON.parse(this.proprietariForm.get('listaImmobiliDTO')?.value) === null? [] : [JSON.parse(this.proprietariForm.get('listaImmobiliDTO')?.value)],
      listaImmobiliDTO: this.selectedImmobili,

    };
    console.log(JSON.stringify(proprietario));
    this.proprietarioService.insertProp(proprietario).subscribe({
      next: (data) => {
        console.log('Success' + data);
        this.immobileService.getAllImmobili().subscribe();
      },
      error: (error) => {
        console.log('Error' + error);
      }
    });
  }
  onCheckboxChange(event: Event, immobile: ImmobileModel) {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.selectedImmobili.push(immobile);
    } else {
      this.selectedImmobili = this.selectedImmobili.filter((i: ImmobileModel) => i.id !== immobile.id);
    }
    console.log(this.selectedImmobili);
  }

  ngOnDestroy(): void {
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }

}
