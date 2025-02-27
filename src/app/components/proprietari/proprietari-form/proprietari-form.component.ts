import {Component, inject, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {ProprietarioService} from '../../../services/proprietario.service';
import {ImmobileService} from '../../../services/immobile.service';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule,} from '@angular/common';
import {ImmobileModel} from '../../../models/immobile.model';
import {ProprietarioModel} from '../../../models/proprietario.model';
import {Router, RouterLink} from '@angular/router';
import {Subscription} from 'rxjs';
import {NgMultiSelectDropDownModule , IDropdownSettings} from 'ng-multiselect-dropdown';


@Component({
  selector: 'app-proprietari-form',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    CommonModule,
    FormsModule,
    NgMultiSelectDropDownModule,
  ],
  templateUrl: './proprietari-form.component.html',
  styleUrl: './proprietari-form.component.css',
  encapsulation: ViewEncapsulation.None // Disabilita l'incapsulamento degli stili
})
export class ProprietariFormComponent implements OnInit, OnDestroy {
  private proprietarioService = inject(ProprietarioService);
  private immobileService = inject(ImmobileService);
  private fb = inject(FormBuilder);

  proprietariForm!: FormGroup;
  listaImmobiliNOProp: ImmobileModel[] = [];
  dropdownSettings: IDropdownSettings = {};

  selectedImmobili: ImmobileModel[] = [];
  isValid: boolean = true

  private subscription = new Subscription();
  private router = inject(Router);


  ngOnInit(): void {
    this.subscription.add(
      this.immobileService.getListaImmobili$().subscribe({
        next: (data: ImmobileModel[]) => {
          this.listaImmobiliNOProp = data.filter((i: ImmobileModel) => !i.proprietariDTO);
        },
        error: (error) => {
          console.log(error);
        }
      })
    );
    this.immobileService.getAllImmobili().subscribe();
    this.proprietariForm = this.fb.group({
      nome: ['', Validators.required],
      cognome: ['', Validators.required],
      listaImmobiliDTO: [],
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
    this.selectedImmobili = this.proprietariForm.get('listaImmobiliDTO')?.value || [];

    // Controlla se l'elemento è già presente nell'array
    if (!this.selectedImmobili.some((immobile: ImmobileModel) => immobile.id === item.id)) {
      this.selectedImmobili.push(item);
    }

    this.proprietariForm.get('listaImmobiliDTO')?.setValue(this.selectedImmobili);
    console.log(this.selectedImmobili);
  }

  onSelectAll(items: any) {
    this.selectedImmobili = this.proprietariForm.get('listaImmobiliDTO')?.value || [];

    // Filtra duplicati
    items.forEach((item: ImmobileModel) => {
      if (!this.selectedImmobili.some((annesso: ImmobileModel) => annesso.id === item.id)) {
        this.selectedImmobili.push(item);
      }
    });

    this.proprietariForm.get('listaImmobiliDTO')?.setValue(this.selectedImmobili);
    console.log(this.selectedImmobili);
  }

  onItemDeSelect(item: any) {
    this.selectedImmobili = this.proprietariForm.get('listaImmobiliDTO')?.value || [];
    //rimuove
    this.selectedImmobili = this.selectedImmobili.filter((a: ImmobileModel) => a.id !== item.id);

    this.proprietariForm.get('listaImmobiliDTO')?.setValue(this.selectedImmobili);
    console.log(this.selectedImmobili);
  }
  serializeImmobile(immobile: ImmobileModel) {
    return JSON.stringify(immobile);
  }

  // onCheckboxChange(event: Event, immobile: ImmobileModel) {
  //   const checkbox = event.target as HTMLInputElement;
  //   if (checkbox.checked) {
  //     this.selectedImmobili.push(immobile);
  //   } else {
  //     this.selectedImmobili = this.selectedImmobili.filter((i: ImmobileModel) => i.id !== immobile.id);
  //   }
  //   console.log(this.selectedImmobili);
  // }

  onSubmit() {
    if (this.proprietariForm.valid) {

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
          // this.immobileService.getAllImmobili().subscribe();
          this.proprietariForm.reset()
          this.refreshData()
          this.router.navigate(['/proprietariTable']);

        },
        error: (error) => {
          console.log('Error' + error);
        }
      });
    } else {
      this.isValid = false;
    }
  }
  refreshData(){
    this.immobileService.getAllImmobili().subscribe();
    this.proprietarioService.getAllProprietari().subscribe();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
