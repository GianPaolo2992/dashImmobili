import {
  Component,
  ElementRef,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {ImmobileModel} from '../../../models/immobile.model';
import {NgForOf, NgIf} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AnnessoModel} from '../../../models/annesso.model';
import {combineLatest, Subscription} from 'rxjs';
import {ProprietarioService} from '../../../services/proprietario.service';
import {AnnessoService} from '../../../services/annesso.service';
import {ProprietarioModel} from '../../../models/proprietario.model';
import {ImmobileService} from '../../../services/immobile.service';
import {IMMOBILI_OPTIONS, Option} from '../../../constants/options';
import {SquareMetersDirective} from '../../../directives/square-meters.directive';
import {EuroDirective} from '../../../directives/euro.directive';

@Component({
  selector: 'app-immobile-update-form',
  imports: [
    NgForOf,
    NgIf,
    ReactiveFormsModule,

  ],
  templateUrl: './immobile-update-form.component.html',
  styleUrl: './immobile-update-form.component.css'
})
export class ImmobileUpdateFormComponent implements OnInit, OnDestroy, OnChanges {
  @Input() immobile?: ImmobileModel;
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
  listaAnnessi?: AnnessoModel[];
  listaAnnessiNoIMMBL?: AnnessoModel[];
  oldProp?: ProprietarioModel;

  isValid = true;

  openDialog() {
    const dialogElement = this.dialog?.nativeElement;
    dialogElement?.show();
    setTimeout(() => {
      dialogElement!.style.opacity = '1';
      dialogElement!.style.transform = 'scale(1)';
    }, 500);
  }

  ngOnInit(): void {
    this.subscription.add(
      combineLatest([
        this.proprietarioService.getListaProprietari$(),
        this.annessoService.getListaAnnessi$()
      ]).subscribe({
        next: ([props, allAnnessi]) => {
          this.listaProprietari = props;
          this.listaAnnessi = allAnnessi.filter(annesso => annesso.immobileDTO === this.immobile);
          this.listaAnnessiNoIMMBL = allAnnessi.filter(annesso => annesso.immobileDTO === undefined);
        },
        error: error => {
          console.log('error', error);
        }
      })
    );
    console.log(this.listaAnnessiNoIMMBL);
    this.proprietarioService.getAllProprietari().subscribe();
    this.annessoService.getAllAnnessi().subscribe();
    this.immobiliForm = this.fb.group({
      tipo: ['', Validators.required],
      vani: [0, Validators.required],
      costo: [0, Validators.required],
      superfice: [0, Validators.required],
      anno: [0, Validators.required],
      proprietariDTO: [null], //this.oldProp, //inizializzato null
      listaAnnessiDTO: [null],
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['immobile'] && this.immobile) {
      this.immobiliForm.patchValue({
        id: this.immobile.id,
        tipo: this.immobile.tipo,
        vani: this.immobile.vani,
        costo: this.immobile.costo,
        superfice: this.immobile.superfice,
        anno: this.immobile.anno!,
        proprietariDTO: this.immobile.proprietariDTO,
        listaAnnessiDTO: this.immobile.listaAnnessiDTO,

      });
      console.log(JSON.stringify(this.immobiliForm.get('proprietariDTO')?.value));
      // Aggiungi gli immobili del proprietario alla lista di immobili selezionati
      this.oldProp = this.immobile.proprietariDTO;

      this.selectedAnnessi = [...this.immobile.listaAnnessiDTO];
    }
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

  serializeProprietario(prop: ProprietarioModel) {
    return JSON.stringify(prop);

  }


  onSubmit() {
    // const superficieValue = this.immobiliForm.get('superfice')?.value.replace(/[^0-9]/g, '');
    // const costoValue =  this.immobiliForm.get('costo')?.value.replace(/[^0-9]/g, '');
    if (this.immobiliForm.valid) {

      const proprietariValue = this.immobiliForm.get('proprietariDTO')!.value;
      const proprietariDTO = proprietariValue ? (typeof proprietariValue === 'string' ? JSON.parse(proprietariValue) : proprietariValue) : null;

      const IMMOBILE: ImmobileModel = {
        id: this.immobile!.id,
        tipo: this.immobiliForm.get('tipo')?.value,
        vani: this.immobiliForm.get('vani')?.value,
        costo: this.immobiliForm.get('costo')?.value,
        superfice: this.immobiliForm.get('superfice')?.value,
        // costo: costoValue ? parseFloat(costoValue.replace(/[^0-9.]/g, '')) : 0,
        // superfice: superficieValue ? parseFloat(superficieValue.replace(/[^0-9.]/g, '')) : 0,
        anno: this.immobiliForm.get('anno')?.value,
        proprietariDTO: proprietariDTO,
        listaAnnessiDTO: this.selectedAnnessi

      }
      console.log(JSON.stringify(IMMOBILE));
      this.immobileService.updateImmobile(IMMOBILE).subscribe({
        next: (result) => {
          console.log('success', result);
          this.onClose()
          this.immobileService.getAllImmobili().subscribe();
          this.proprietarioService.getAllProprietari().subscribe();
          this.annessoService.getAllAnnessi().subscribe()
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

  onClose() {
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
