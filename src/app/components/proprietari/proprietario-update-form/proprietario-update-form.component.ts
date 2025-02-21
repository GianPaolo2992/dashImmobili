// import {
//   Component,
//   ElementRef, Inject,
//   inject,
//   Input,
//   OnChanges,
//   OnDestroy,
//   OnInit,
//   SimpleChanges,
//   ViewChild
// } from '@angular/core';
// import {ProprietarioModel} from '../../../models/proprietario.model';
// import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
// import {ImmobileModel} from '../../../models/immobile.model';
// import {Subscription} from 'rxjs';
// import {ImmobileService} from '../../../services/immobile.service';
// import {NgForOf, NgIf} from '@angular/common';
//
// @Component({
//   selector: 'app-proprietario-update-form',
//   imports: [
//     // NgForOf,
//     NgIf,
//     ReactiveFormsModule,
//     NgForOf
//   ],
//   templateUrl: './proprietario-update-form.component.html',
//   styleUrl: './proprietario-update-form.component.css'
// })
// export class ProprietarioUpdateFormComponent implements OnInit, OnDestroy, OnChanges {
//
//   @Input() proprietario!: ProprietarioModel;
//
//   @ViewChild('dialog') dialog?: ElementRef<HTMLDialogElement>;
//
//   propUpdateForm!: FormGroup;
//
//    listaImmobile?: ImmobileModel[];
//    listaImmobiliNOProp?: ImmobileModel[];
//   private subscription: Subscription = new Subscription();
//   private immobileService = inject(ImmobileService)
//   private fb = inject(FormBuilder)
//
//   ngOnInit(): void {
//     this.subscription.add(
//       this.immobileService.getListaImmobili$().subscribe({
//           next: (data:ImmobileModel[]) => {
//             this.listaImmobile = data
//             this.listaImmobiliNOProp = this.listaImmobile.filter((i: ImmobileModel) => !i.proprietariDTO);
//             // console.log('lista immobili senza proprietario' + JSON.stringify(this.listaImmobiliNOProp));
//
//           //  this.listaImmobiliNOProp =  this.listaImmobile.filter((i: ImmobileModel) => {
//           //      i.proprietariDTO.listaImmobiliDTO.some(
//           //       (immobile: ImmobileModel) => immobile.id === null
//           //     );
//           //
//           //   })
//           //   console.log('lista immobili proprietario' + JSON.stringify(this.listaImmobiliNOProp))
//           }
//         }
//       )
//     )
//     this.immobileService.getAllImmobili().subscribe()
//     this.propUpdateForm = this.fb.group({
//       nome: ['', Validators.required],
//       cognome: ['', Validators.required],
//       listaImmobiliDTO: [null],
//
//     })
//
//   }
//
//   ngOnChanges(changes: SimpleChanges): void {
//     if (changes['proprietario'] && this.proprietario) {
//       this.propUpdateForm.patchValue({
//         id: this.proprietario.id,
//         nome: this.proprietario.nome,
//         cognome: this.proprietario.cognome,
//         listaImmobileDTO:this.proprietario.listaImmobiliDTO
//       });
//     }
//   }
//
//   openDialog() {
//     const dialogElement = this.dialog?.nativeElement;
//     dialogElement?.show();
//
//     setTimeout(() => {
//       dialogElement!.style.opacity = '1';
//       dialogElement!.style.transform = 'scale(1)';
//     }, 500);
//   }
//
//   onSubmit() {
// const proprietario: ProprietarioModel = {
//   id: this.proprietario.id,
//   nome:this.propUpdateForm.get('nome')?.value,
//   cognome:this.propUpdateForm.get('cognome')?.value,
//   // listaImmobiliDTO: this.proprietario.listaImmobiliDTO,
//   listaImmobiliDTO:this.propUpdateForm.get('listaImmobiliDTO')?.value,
//
// }
// console.log('submit proprietario' + JSON.stringify(proprietario));
// console.log('submit proprietario' + JSON.stringify(proprietario.listaImmobiliDTO));
//
//   }
//
//   onClose() {
//     const dialogElement = this.dialog?.nativeElement;
//     dialogElement!.style.opacity = '0';
//     dialogElement!.style.transform = 'scale(0.7)';
//     setTimeout(() => {
//       dialogElement!.close();
//     }, 500); // Durata della transizione
//   }
//   Log(immobile: ImmobileModel) {
//     console.log(immobile);
//   }
//
//   ngOnDestroy(): void {
//   }
//
//
// }
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
import {ProprietarioModel} from '../../../models/proprietario.model';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ImmobileModel} from '../../../models/immobile.model';
import {Subscription} from 'rxjs';
import {ImmobileService} from '../../../services/immobile.service';
import {NgForOf, NgIf} from '@angular/common';
import {ProprietarioService} from '../../../services/proprietario.service';

@Component({
  selector: 'app-proprietario-update-form',
  imports: [NgIf, ReactiveFormsModule, NgForOf],
  templateUrl: './proprietario-update-form.component.html',
  styleUrl: './proprietario-update-form.component.css'
})
export class ProprietarioUpdateFormComponent implements OnInit, OnDestroy, OnChanges {

  @Input() proprietario?: ProprietarioModel;
  @ViewChild('dialog') dialog?: ElementRef<HTMLDialogElement>;
  propUpdateForm!: FormGroup;
  listaImmobile?: ImmobileModel[];// getAll immobili
  listaImmobiliNOProp?: ImmobileModel[];  //filtrato per proprietari null
  selectedImmobili: ImmobileModel[] = []; // proprietà per tenere traccia degli immobili selezionati
  private subscription: Subscription = new Subscription();
  private immobileService = inject(ImmobileService);
  private proprietarioService = inject(ProprietarioService);
  private fb = inject(FormBuilder);

  ngOnInit(): void {
    this.subscription.add(
      this.immobileService.getListaImmobili$().subscribe({
        next: (data: ImmobileModel[]) => {
          this.listaImmobile = data;
          this.listaImmobiliNOProp = this.listaImmobile.filter((i: ImmobileModel) => !i.proprietariDTO);
        },
        error: (error) =>{
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
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['proprietario'] && this.proprietario) {
      this.propUpdateForm.patchValue({
        id: this.proprietario.id,
        nome: this.proprietario.nome,
        cognome: this.proprietario.cognome,
        listaImmobileDTO: this.proprietario.listaImmobiliDTO
      });

      // Aggiungi gli immobili del proprietario alla lista di immobili selezionati
      this.selectedImmobili = [...this.proprietario.listaImmobiliDTO];
    }
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



  onSubmit() {
    const proprietario: ProprietarioModel = {
      id: this.proprietario!.id,
      nome: this.propUpdateForm.get('nome')?.value,
      cognome: this.propUpdateForm.get('cognome')?.value,
      listaImmobiliDTO: this.selectedImmobili
    };
    console.log('submit proprietario' + JSON.stringify(proprietario));
    this.proprietarioService.updateProp(proprietario).subscribe({
      next:(result) => {
        console.log('proprietario', result);
        this.onClose()
        this.proprietarioService.getAllProprietari().subscribe()
        this.immobileService.getAllImmobili().subscribe();

      },
      error: error => {
        console.log('Errore durante l\'aggiornamento:', error);
      }
    })
  }
  openDialog() {
    const dialogElement = this.dialog?.nativeElement;
    dialogElement?.show();
    setTimeout(() => {
      dialogElement!.style.opacity = '1';
      dialogElement!.style.transform = 'scale(1)';
    }, 500);
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
    this.subscription.unsubscribe();
  }
}
