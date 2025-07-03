import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'boliviaDate',
  standalone: true,
})
export class BoliviaDatePipe implements PipeTransform {
  private readonly datePipe = new DatePipe('es');

  transform(value: string | Date, format: string = 'dd/MM/yyyy HH:mm'): string {
    if (!value) return '';

    const boliviaFormat = format === 'short' ? 'dd/MM/yyyy HH:mm' : format;

    // Debug: ver qué fecha está llegando
    console.log('Fecha original del backend:', value);
    console.log('Tipo de fecha:', typeof value);

    const result =
      this.datePipe.transform(value, boliviaFormat, 'America/La_Paz') ?? '';

    // Debug: ver el resultado
    console.log('Fecha formateada Bolivia:', result);

    return result;
  }
}
