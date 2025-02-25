import {Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
  selector: '[appEuro]'
})
export class EuroDirective {

  constructor(private el: ElementRef) {
    this.applyInitialFormat()

  }

  @HostListener('input', ['$event']) onInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    // Logica per la gestione del simbolo dell'euro
    value = value.replace(/[^0-9.]/g, ''); // Permette solo numeri e punti decimali
    input.value = value;

    this.applyFormat();
  }
  private applyInitialFormat() {
    const input = this.el.nativeElement as HTMLInputElement;
    if (!input.value) {
      this.el.nativeElement.value = `€ `;
    }
  }
  private applyFormat() {
    const input = this.el.nativeElement as HTMLInputElement;
    if (input.value) {
      this.el.nativeElement.value = `€ ${input.value}`;
    }
  }
}

