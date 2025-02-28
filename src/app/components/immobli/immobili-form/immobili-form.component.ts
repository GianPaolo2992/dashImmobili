import {Component, inject, OnInit, ViewEncapsulation} from '@angular/core';
import {CommonModule, NgForOf, NgIf} from "@angular/common";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {ImmobileService} from '../../../services/immobile.service';
import {ProprietarioService} from '../../../services/proprietario.service';
import {AnnessoService} from '../../../services/annesso.service';
import {ProprietarioModel} from '../../../models/proprietario.model';
import {AnnessoModel} from '../../../models/annesso.model';
import {ImmobileModel} from '../../../models/immobile.model';
import {combineLatest, Subscription} from 'rxjs';
import {IMMOBILI_OPTIONS, Option} from '../../../constants/options';

import {IDropdownSettings, NgMultiSelectDropDownModule} from 'ng-multiselect-dropdown';


@Component({
  selector: 'app-immobili-form',
  imports: [
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    RouterLink,
    CommonModule,
    FormsModule,
    NgMultiSelectDropDownModule,
  ],

  templateUrl: './immobili-form.component.html',
  styleUrl: './immobili-form.component.css',
  encapsulation: ViewEncapsulation.None
})
export class ImmobiliFormComponent implements OnInit {
  private immobileService = inject(ImmobileService);
  private proprietarioService = inject(ProprietarioService);
  private annessoService = inject(AnnessoService);
  private fb = inject(FormBuilder)
  private subscription: Subscription = new Subscription();

  private router = inject(Router);


  immobiliForm!: FormGroup;
  listaProprietari?: ProprietarioModel[]
  listaAnnessiNoIMMBL: AnnessoModel[] = [];
  selectedAnnessi: AnnessoModel[] = [];
  dropdownSettings: IDropdownSettings = {};
  immobiliOptions: Option[] = IMMOBILI_OPTIONS;
  isValid = true;

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
    this.refreshData();


    this.immobiliForm = this.fb.group({

      tipo: ['', Validators.required],
      vani: [1, [Validators.required, Validators.minLength(1)]],
      costo: [1, [Validators.required, Validators.minLength(1)]],
      superfice: [5, [Validators.required, Validators.minLength(5)]],
      anno: [1980, [Validators.required]],
      proprietariDTO: [null,[Validators.required]],
      listaAnnessiDTO: [],
    })
    this.dropdownSettings = {
      idField: 'id',
      textField: 'tipo',
      enableCheckAll: true,
      selectAllText: 'Seleziona Tutti',
      unSelectAllText: 'Deseleziona Tutti',
      allowSearchFilter: true,
      noDataAvailablePlaceholderText: 'Nessun dato disponibile'
    };

  }


  onItemSelect(item: any) {
    this.selectedAnnessi = this.immobiliForm.get('listaAnnessiDTO')?.value || [];

    // Controlla se l'elemento è già presente nell'array
    if (!this.selectedAnnessi.some((annesso: AnnessoModel) => annesso.id === item.id)) {
      this.selectedAnnessi.push(item);
    }

    this.immobiliForm.get('listaAnnessiDTO')?.setValue(this.selectedAnnessi);
    console.log(this.selectedAnnessi);
  }

  onSelectAll(items: any) {
    this.selectedAnnessi = this.immobiliForm.get('listaAnnessiDTO')?.value || [];

    // Filtra duplicati
    items.forEach((item: AnnessoModel) => {
      if (!this.selectedAnnessi.some((annesso: AnnessoModel) => annesso.id === item.id)) {
        this.selectedAnnessi.push(item);
      }
    });

    this.immobiliForm.get('listaAnnessiDTO')?.setValue(this.selectedAnnessi);
    console.log(this.selectedAnnessi);
  }

  onItemDeSelect(item: any) {
    this.selectedAnnessi = this.immobiliForm.get('listaAnnessiDTO')?.value || [];
    //rimuove
    this.selectedAnnessi = this.selectedAnnessi.filter((a: AnnessoModel) => a.id !== item.id);

    this.immobiliForm.get('listaAnnessiDTO')?.setValue(this.selectedAnnessi);
    console.log(this.selectedAnnessi);
  }


  serializeProprietario(prop: ProprietarioModel) {
    return JSON.stringify(prop);
  }

  serializeAnnessi(ann: AnnessoModel) {
    return JSON.stringify(ann);
  }

  //
  // onCheckboxChange(event: Event, annesso: AnnessoModel) {
  //   const checkbox = event.target as HTMLInputElement;
  //   if (checkbox.checked) {
  //     this.selectedAnnessi.push(annesso);
  //   } else {
  //     this.selectedAnnessi = this.selectedAnnessi.filter((a: AnnessoModel) => a.id !== annesso.id);
  //   }
  //   console.log(this.selectedAnnessi);
  // }
  refreshData() {
    this.immobileService.getAllImmobili().subscribe();
    this.proprietarioService.getAllProprietari().subscribe();
    this.annessoService.getAllAnnessi().subscribe();
  }

  onSubmit() {
    // const costoValue = this.immobiliForm.get('costo')?.value;
    // const superficieValue = this.immobiliForm.get('superfice')?.value;
    if (this.immobiliForm.valid) {

      const immobile: ImmobileModel = {
        tipo: this.immobiliForm.get('tipo')?.value,
        vani: this.immobiliForm.get('vani')?.value,
        costo: this.immobiliForm.get('costo')?.value,
        superfice: this.immobiliForm.get('superfice')?.value,
        // costo: costoValue ? parseFloat(costoValue.replace(/[^0-9.]/g, '')) : 0,
        // superfice: superficieValue ? parseFloat(superficieValue.replace(/[^0-9.]/g, '')) : 0,
        anno: this.immobiliForm.get('anno')?.value,
        proprietariDTO: JSON.parse(this.immobiliForm.get('proprietariDTO')?.value),
        listaAnnessiDTO: this.selectedAnnessi!,
      }
      console.log(immobile);
      this.immobileService.insertImmobile(immobile).subscribe({
        next: (nextData: ImmobileModel) => {
          console.log('Success' + nextData);
          this.immobiliForm.reset();
          this.refreshData();
          this.router.navigate(['/immobiliTable']);
        },
        error: (err) => {
          console.log(err);
        }

      })
    } else {
      console.log('form non valido')
      this.isValid = false
    }
  }


}
