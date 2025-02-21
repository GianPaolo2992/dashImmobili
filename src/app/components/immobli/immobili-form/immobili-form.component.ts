import {Component, inject, OnInit} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {ImmobileService} from '../../../services/immobile.service';
import {ProprietarioService} from '../../../services/proprietario.service';
import {AnnessoService} from '../../../services/annesso.service';
import {ProprietarioModel} from '../../../models/proprietario.model';
import {AnnessoModel} from '../../../models/annesso.model';
import {ImmobileModel} from '../../../models/immobile.model';
import {combineLatest, forkJoin, Subscription} from 'rxjs';
import {IMMOBILI_OPTIONS, Option} from '../../../constants/options';

@Component({
  selector: 'app-immobili-form',
  imports: [
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './immobili-form.component.html',
  styleUrl: './immobili-form.component.css'
})
export class ImmobiliFormComponent implements OnInit {
  private immobileService = inject(ImmobileService);
  private proprietarioService = inject(ProprietarioService);
  private annessoService = inject(AnnessoService);
  private fb = inject(FormBuilder)
  private subscription: Subscription = new Subscription();
  immobiliForm!: FormGroup;
  listaProprietari?: ProprietarioModel[]
  listaAnnessiNoIMMBL?: AnnessoModel[] = [];
  selectedAnnessi: AnnessoModel[] = [];
  immobiliOptions:Option[] = IMMOBILI_OPTIONS;


  ngOnInit(): void {
    this.subscription.add(
      combineLatest([
        this.proprietarioService.getListaProprietari$(),
        this.annessoService.getListaAnnessi$()
      ]).subscribe({
        next: ([props, allAnnessi]) => {
          this.listaProprietari = props;
          this.listaAnnessiNoIMMBL = allAnnessi.filter(annesso => annesso.immobileDTO === undefined);
        },
        error: error => {
          console.log('error', error);
        }
      })
    );
    this.proprietarioService.getAllProprietari().subscribe();
      this.annessoService.getAllAnnessi().subscribe();




    this.immobiliForm = this.fb.group({

      tipo: ['', Validators.required],
      vani: [1, [Validators.required, Validators.minLength(1)]],
      costo: [1, [Validators.required, Validators.minLength(1)]],
      superfice: [5, [Validators.required, Validators.minLength(5)]],
      anno: [1980, [Validators.required]],
      proprietariDTO: [null],
      listaAnnessiDTO: [],
    })
  }

  serializeProprietario(prop: ProprietarioModel) {
    return JSON.stringify(prop);
  }

  serializeAnnessi(ann: AnnessoModel) {
    return JSON.stringify(ann);
  }

  onSubmit() {
    const immobile: ImmobileModel = {
      tipo: this.immobiliForm.get('tipo')?.value,
      vani: this.immobiliForm.get('vani')?.value,
      costo: this.immobiliForm.get('costo')?.value,
      superfice: this.immobiliForm.get('superfice')?.value,
      anno: this.immobiliForm.get('anno')?.value,
      proprietariDTO: JSON.parse(this.immobiliForm.get('proprietariDTO')?.value),
      listaAnnessiDTO: this.selectedAnnessi!,
    }
    console.log(immobile);
    this.immobileService.insertImmobile(immobile).subscribe({
      next: (nextData: ImmobileModel) => {
        console.log('Success' + nextData);
        // this.immobiliForm.reset();
        this.ngOnInit();
      },
      error: (err) => {
        console.log(err);
      }

    })
  }



onCheckboxChange(event: Event, annesso: AnnessoModel) {
  const checkbox = event.target as HTMLInputElement;
  if (checkbox.checked) {
    this.selectedAnnessi.push(annesso);
  } else {
    this.selectedAnnessi = this.selectedAnnessi.filter((a: AnnessoModel) => a.id !== annesso.id);
  }
  console.log(this.selectedAnnessi);
}


}
