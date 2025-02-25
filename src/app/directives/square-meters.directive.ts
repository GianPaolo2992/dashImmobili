import {Directive, ElementRef, HostListener, Renderer2} from '@angular/core';

@Directive({
  selector: '[appSquareMeters]'
})
export class SquareMetersDirective {

  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.applyFormat();
  }

  @HostListener('input', ['$event']) onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    // Rimuove tutte le lettere e lascia solo numeri e un punto
    const sanitizedValue = value.replace(/[^0-9.]/g, '');

    // Aggiorna il valore dell'input
    this.renderer.setProperty(input, 'value', sanitizedValue);
    this.applyFormat();
  }

  private applyFormat(): void {
    const input = this.el.nativeElement as HTMLInputElement;
    if (input.value) {
      this.renderer.setProperty(input, 'value', `${input.value} m²`);
    }
  }
}
