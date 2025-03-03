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
import {ImmobileModel} from '../../../models/immobile.model';
import {CommonModule, NgForOf, NgIf} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {AnnessoModel} from '../../../models/annesso.model';
import {combineLatest, Subscription} from 'rxjs';
import {ProprietarioService} from '../../../services/proprietario.service';
import {AnnessoService} from '../../../services/annesso.service';
import {ProprietarioModel} from '../../../models/proprietario.model';
import {ImmobileService} from '../../../services/immobile.service';
import {IMMOBILI_OPTIONS, Option} from '../../../constants/options';

import {IDropdownSettings, NgMultiSelectDropDownModule} from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-immobile-update-form',
  imports: [
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    NgMultiSelectDropDownModule,
  ],
  templateUrl: './immobile-update-form.component.html',
  styleUrl: './immobile-update-form.component.css',
  encapsulation: ViewEncapsulation.None
})
export class ImmobileUpdateFormComponent implements OnInit, OnDestroy, OnChanges {
  @Input() immobile!: ImmobileModel;
  @ViewChild('dialog') dialog!: ElementRef<HTMLDialogElement>
  private fb = inject(FormBuilder);
  private immobileService = inject(ImmobileService)
  private proprietarioService = inject(ProprietarioService);
  private annessoService = inject(AnnessoService);

  private subscription: Subscription = new Subscription();
  immobiliOptions: Option[] = IMMOBILI_OPTIONS;

  immobiliForm!: FormGroup;
  selectedAnnessi: AnnessoModel[] = [];
  listaProprietari?: ProprietarioModel[];

  listaAnnessi: AnnessoModel[] = [];

  listaAnnessiUnica: AnnessoModel[] = [];  // Array unico per tutti gli annessi

  oldProp?: ProprietarioModel;
  dropdownSettings: IDropdownSettings = {};
  isValid = true;


  ngOnInit(): void {
    this.subscription.add(
      combineLatest([
        this.proprietarioService.getListaProprietari$(),
        this.annessoService.getListaAnnessi$()
      ]).subscribe({
        next: ([props, allAnnessi]: [ProprietarioModel[], AnnessoModel[]]) => {
          this.listaProprietari = props;
          this.listaAnnessi = allAnnessi;
          console.log(this.listaAnnessi);

        },
        error: error => {
          console.log('error', error);
        }
      })
    );
    this.proprietarioService.getAllProprietari().subscribe();
    this.annessoService.getAllAnnessi().subscribe()
    this.immobiliForm = this.fb.group({
      tipo: ['', Validators.required],
      vani: [0, Validators.required],
      costo: [0, Validators.required],
      superfice: [0, Validators.required],
      anno: [0, Validators.required],
      proprietariDTO: [null, [Validators.required]],
      listaAnnessiDTO: [null],
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


  ngOnChanges(changes: SimpleChanges): void {

    if (changes['immobile'] && changes['immobile'].currentValue) {
      console.log('🔄 immobile cambiato:', changes['immobile'].currentValue);
      console.log(this.immobile)
      this.proprietarioService.getAllProprietari().subscribe();
      this.annessoService.getAllAnnessi().subscribe()
      this.openDialog();
      this.patchForm();
    }
  }


  patchForm(): void {
    console.log(this.immobile)
    if (this.immobile) {

      this.listaAnnessiUnica = this.listaAnnessi
        .filter(a => a.immobileDTO?.id === this.immobile!.id || !a.immobileDTO);

      console.log(this.listaAnnessiUnica);

      this.selectedAnnessi = this.listaAnnessiUnica
        .filter(annesso => annesso.immobileDTO && annesso.immobileDTO.id === this.immobile!.id);


      console.log(this.selectedAnnessi);
      // this.oldProp = this.listaProprietari?.find(p => p.id === this.immobile!.proprietariDTO.id)
      this.oldProp = this.immobile.proprietariDTO
      console.log(this.oldProp);
      this.immobiliForm.patchValue({
        id: this.immobile.id,
        tipo: this.immobile.tipo,
        vani: this.immobile.vani,
        costo: this.immobile.costo,
        superfice: this.immobile.superfice,
        anno: this.immobile.anno,
        proprietariDTO: this.oldProp ? JSON.stringify(this.oldProp) : null,  // Controllo oldProp e serializzazione
        listaAnnessiDTO: this.selectedAnnessi,
      });
    }

  }

  onItemSelect(item: any) {
    if (!this.selectedAnnessi.some(annesso => annesso.id === item.id)) {
      this.selectedAnnessi.push(item);
    }
    this.immobiliForm.get('listaAnnessiDTO')?.setValue(this.selectedAnnessi);
    console.log(this.selectedAnnessi);
  }

  onItemDeSelect(item: any) {
    this.selectedAnnessi = this.selectedAnnessi
      .filter(annesso => annesso.id !== item.id);
    this.immobiliForm.get('listaAnnessiDTO')?.setValue(this.selectedAnnessi);
    console.log(this.selectedAnnessi);
  }

  onSelectAll(items: any[]) {
    this.selectedAnnessi = items;
    this.immobiliForm.get('listaAnnessiDTO')?.setValue(this.selectedAnnessi);
    console.log(this.selectedAnnessi);
  }

  onDeSelectAll() {
    this.selectedAnnessi = [];
    this.immobiliForm.get('listaImmobiliDTO')?.setValue(this.selectedAnnessi);
    console.log(this.selectedAnnessi);

  }

  serializeProprietario(prop: ProprietarioModel) {
    return JSON.stringify(prop);
  }


  onSubmit() {
    // const superficieValue = this.immobiliForm.get('superfice')?.value.replace(/[^0-9]/g, '');
    // const costoValue =  this.immobiliForm.get('costo')?.value.replace(/[^0-9]/g, '');
    if (this.immobiliForm.valid) {


      const IMMOBILE: ImmobileModel = {
        id: this.immobile!.id,
        tipo: this.immobiliForm.get('tipo')?.value,
        vani: this.immobiliForm.get('vani')?.value,
        costo: this.immobiliForm.get('costo')?.value,
        superfice: this.immobiliForm.get('superfice')?.value,
        // costo: costoValue ? parseFloat(costoValue.replace(/[^0-9.]/g, '')) : 0,
        // superfice: superficieValue ? parseFloat(superficieValue.replace(/[^0-9.]/g, '')) : 0,
        anno: this.immobiliForm.get('anno')?.value,
        proprietariDTO: this.immobiliForm.get('proprietariDTO')?.value ? JSON.parse(this.immobiliForm.get('proprietariDTO')?.value) : null,
        listaAnnessiDTO: this.selectedAnnessi

      }
      this.immobileService.updateImmobile(IMMOBILE).subscribe({
        next: (result) => {
          console.log('success', result);
          this.onClose()

        },
        error: error => {
          console.log('error', error);
        }
      });
    } else {
      //   messaggio di invalidita del form
      console.log('error form non valido');
      this.isValid = false;
    }
  }

  refreshData(): void {
    this.immobileService.getAllImmobili().subscribe();
    this.proprietarioService.getAllProprietari().subscribe();
    this.annessoService.getAllAnnessi().subscribe()
  }

  onClose() {
    this.refreshData();
    this.selectedAnnessi = [];
    // this.patchForm();

    const dialogElement = this.dialog?.nativeElement;
    dialogElement!.style.opacity = '0';
    dialogElement!.style.transform = 'scale(0.7)';
    setTimeout(() => {
      dialogElement!.close();
    }, 500); // Durata della transizione
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}

