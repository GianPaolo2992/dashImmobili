import {Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AnnessoService} from '../../../services/annesso.service';
import {AnnessoModel} from '../../../models/annesso.model';
import {ImmobileModel} from '../../../models/immobile.model';
import {Subscription} from 'rxjs';
import {ImmobileService} from '../../../services/immobile.service';
import {ANNESSI_OPTIONS, Option} from '../../../constants/options';
import {AuthService} from '../../../services/auth.service';


@Component({
  selector: 'app-annessi-update-form',
  imports: [
    // AsyncPipe,
    NgForOf,
    NgIf,
    ReactiveFormsModule,

  ],
  templateUrl: './annessi-update-form.component.html',
  styleUrl: './annessi-update-form.component.css'
})
export class AnnessiUpdateFormComponent implements OnInit, OnChanges, OnDestroy {

  @Input() annesso?: AnnessoModel;
  @ViewChild('dialog') dialog?: ElementRef<HTMLDialogElement>;

  annessiUpdateForm!: FormGroup;
  annessiOptions: Option[] = ANNESSI_OPTIONS;
  listaImmobili?: ImmobileModel[];
  immobileDTO?: ImmobileModel;
  isValid = true;
  private subscription: Subscription = new Subscription();

  constructor(private fb: FormBuilder, private annessoService: AnnessoService, private immobileService: ImmobileService) {
  }

  ngOnInit(): void {
    this.subscription.add(
      this.immobileService.getListaImmobili$().subscribe(data => {
        this.listaImmobili = data;

      })
    );
    this.immobileService.getAllImmobili().subscribe();

    this.annessiUpdateForm = this.fb.group({
      id: [''],
      tipo: ['', Validators.required],
      superficie: [0, [Validators.required, Validators.min(1)]],
      immobileDTO: [null]
    });

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['annesso'] && this.annesso) {
      this.annessoService.getAllAnnessi().subscribe();
      this.immobileService.getAllImmobili().subscribe();
      this.annessiUpdateForm.patchValue({
        id: this.annesso.id,
        tipo: this.annesso.tipo,
        superficie: this.annesso.superficie,
        immobileDTO: this.annesso.immobileDTO

      });
      console.log(JSON.stringify(this.annesso))
      this.immobileDTO = this.annesso.immobileDTO
    }
  }

  openDialog() {

    const dialogElement = this.dialog?.nativeElement;
    dialogElement?.show();

    setTimeout(() => {
      dialogElement!.style.opacity = '1';
      dialogElement!.style.transform = 'scale(1)';
    }, 500);
  }

serializeImmobile(immobile: ImmobileModel) {
   return  JSON.stringify(immobile)
}
  onSubmit() {
    if (this.annessiUpdateForm.valid) {
      const AnnessoUpdated: AnnessoModel = {
        id: this.annesso!.id,
        tipo: this.annessiUpdateForm.get('tipo')!.value,
        superficie: this.annessiUpdateForm.get('superficie')!.value,
        // superficie:  this.annessiUpdateForm.get('superficie')?.value.replace(/[^0-9.]/g, ''),
        immobileDTO: this.annessiUpdateForm.get('immobileDTO')?.value ? JSON.parse(this.annessiUpdateForm.get('immobileDTO')?.value) : null ,
      }

      this.annessoService.updateAnnesso(AnnessoUpdated).subscribe({
        next: data => {
          console.log(JSON.stringify(data));
          this.annessiUpdateForm.reset()
          this.onClose()

          this.annessoService.getAllAnnessi().subscribe();
          this.immobileService.getAllImmobili().subscribe();
        },
        error: error => {
          console.log('Errore durante l\'aggiornamento:', error);

        }
      })
    } else {
      this.isValid = false;
    }
  }


  onClose() {
    this.annessoService.getAllAnnessi().subscribe();
    this.immobileService.getAllImmobili().subscribe();
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
