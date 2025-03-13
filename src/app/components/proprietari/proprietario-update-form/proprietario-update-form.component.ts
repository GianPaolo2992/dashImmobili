import {
  Component,
  ElementRef,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild, ViewEncapsulation
} from '@angular/core';
import {ProprietarioModel} from '../../../models/proprietario.model';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ImmobileModel} from '../../../models/immobile.model';
import {Subscription} from 'rxjs';
import {ImmobileService} from '../../../services/immobile.service';
import {CommonModule, NgIf} from '@angular/common';
import {ProprietarioService} from '../../../services/proprietario.service';
import {IDropdownSettings, NgMultiSelectDropDownModule} from 'ng-multiselect-dropdown';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-proprietario-update-form',
  imports: [
    NgIf,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    NgMultiSelectDropDownModule,
  ],
  templateUrl: './proprietario-update-form.component.html',
  styleUrl: './proprietario-update-form.component.css',
  encapsulation: ViewEncapsulation.None // Disabilita l'incapsulamento degli stili
})
export class ProprietarioUpdateFormComponent implements OnInit, OnDestroy, OnChanges {

  @Input() proprietario?: ProprietarioModel;
  @ViewChild('dialog') dialog?: ElementRef<HTMLDialogElement>;

  private subscription: Subscription = new Subscription();
  private immobileService = inject(ImmobileService);
  private proprietarioService = inject(ProprietarioService);
  private fb = inject(FormBuilder);



  propUpdateForm!: FormGroup;
  listaImmobile: ImmobileModel[] = []; // getAll immobili
  listaImmobiliUnica: ImmobileModel[] = [];  // filtrato per proprietari null
  selectedImmobili: ImmobileModel[] = []; // proprietà per tenere traccia degli immobili selezionati
  dropdownSettings: IDropdownSettings = {};
  isValid = true


  ngOnInit(): void {

    this.subscription.add(
      this.immobileService.getListaImmobili$().subscribe({
        next: (data: ImmobileModel[]) => {
          this.listaImmobile = data
        },
        error: (error) => {
          console.log(error);
        }
      })
    );

    this.immobileService.getAllImmobili().subscribe();

    this.propUpdateForm = this.fb.group({
      nome: ['', Validators.required],
      cognome: ['', Validators.required],
      listaImmobiliDTO: [null]
    });

    this.dropdownSettings = {
      idField: 'id',
      textField: 'tipo',
      enableCheckAll: true,
      selectAllText: 'Seleziona Tutti',
      unSelectAllText: 'Deseleziona Tutti',
      allowSearchFilter: true,
      noDataAvailablePlaceholderText: 'Nessun dato disponibile',
    };

  }

  openDialog() {

    const dialogElement = this.dialog?.nativeElement;
    dialogElement?.show();
    setTimeout(() => {
      dialogElement!.style.opacity = '1';
      dialogElement!.style.transform = 'scale(1)';
    }, 500);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['proprietario'] && changes['proprietario'].currentValue) {

      console.log('🔄 Proprietario cambiato:', changes['proprietario'].currentValue);

      this.immobileService.getAllImmobili().subscribe();
      this.openDialog();

      this.patchForm()
    }
  }

  patchForm(): void {
    if (this.proprietario) {
      this.listaImmobiliUnica = this.listaImmobile.filter(imm => !imm.proprietariDTO || imm.proprietariDTO.id === this.proprietario!.id);
      this.selectedImmobili = this.listaImmobiliUnica
        .filter(imm => imm.proprietariDTO?.id === this.proprietario?.id);
      this.propUpdateForm.patchValue({
        id: this.proprietario.id,
        nome: this.proprietario.nome,
        cognome: this.proprietario.cognome,
        listaImmobiliDTO: this.selectedImmobili,

      });
    }
  }

  onItemSelect(item: any) {
    this.selectedImmobili = this.propUpdateForm.get('listaImmobiliDTO')?.value || [];

    // Controlla se l'elemento è già presente nell'array
    if (!this.selectedImmobili.some((immobile: ImmobileModel) => immobile.id === item.id)) {
      this.selectedImmobili.push(item);
    }

    this.propUpdateForm.get('listaImmobiliDTO')?.setValue(this.selectedImmobili);
    console.log(this.selectedImmobili);
  }

  onSelectAll(items: any[]) {
    this.selectedImmobili = items;

    this.propUpdateForm.get('listaImmobiliDTO')?.setValue(this.selectedImmobili);
    console.log(this.selectedImmobili);
  }

  onDeSelectAll(items: any) {
    this.selectedImmobili = [];
    this.propUpdateForm.get('listaImmobiliDTO')?.setValue(this.selectedImmobili);
    console.log(this.selectedImmobili);
  }

  onItemDeSelect(item: any) {
    // this.selectedImmobili = this.propUpdateForm.get('listaImmobiliDTO')?.value || [];
    //rimuove
    this.selectedImmobili = this.selectedImmobili
      .filter((immobile: ImmobileModel) => immobile.id !== item.id);

    this.propUpdateForm.get('listaImmobiliDTO')?.setValue(this.selectedImmobili);
    console.log(this.selectedImmobili);
  }

  onSubmit() {
    if (this.propUpdateForm.valid) {
      const proprietario: ProprietarioModel = {
        id: this.proprietario!.id,
        nome: this.propUpdateForm.get('nome')?.value,
        cognome: this.propUpdateForm.get('cognome')?.value,
        listaImmobiliDTO: this.selectedImmobili
      };
      console.log('submit proprietario' + JSON.stringify(proprietario));
      this.proprietarioService.updateProp(proprietario).subscribe({
        next: (result) => {
          console.log('proprietario', result);
          this.onClose()
          this.proprietarioService.getAllProprietari().subscribe()
          this.immobileService.getAllImmobili().subscribe();
        },
        error: error => {
          console.log('Errore durante l\'aggiornamento:', error);
        }
      })
    } else {
      console.log('form non valido')
      this.isValid = false
    }
  }


  onClose() {
    this.proprietarioService.getAllProprietari().subscribe();
    const dialogElement = this.dialog?.nativeElement;
    dialogElement!.style.opacity = '0';
    dialogElement!.style.transform = 'scale(0.7)';
    setTimeout(() => {
      dialogElement!.close();
    }, 500);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
