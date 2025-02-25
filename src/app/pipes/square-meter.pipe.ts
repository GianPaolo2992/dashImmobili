import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'squareMeter'
})
export class SquareMeterPipe  implements PipeTransform {

  transform(value: number|undefined): string {
    return value + ' m²';
  }

}
