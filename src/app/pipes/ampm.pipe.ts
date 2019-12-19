import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ampm'
})
export class AmpmPipe implements PipeTransform {

  transform(value: string): string {

    if (value === '06:00:00') {
        return '06:00 am';
    }

    if (value === '07:00:00') {
        return '07:00 am';
    }

    if (value === '08:00:00') {
        return '08:00 am';
    }

    if (value === '09:00:00') {
        return '09:00 am';
    }

    if (value === '10:00:00') {
        return '10:00 am';
    }

    if (value === '11:00:00') {
        return '11:00 am';
    }

    if (value === '12:00:00') {
        return '12:00 am';
    }

    if (value === '13:00:00') {
        return '01:00 pm';
    }

    if (value === '14:00:00') {
        return '02:00 pm';
    }

    if (value === '15:00:00') {
        return '03:00 pm';
    }

    if (value === '16:00:00') {
        return '04:00 pm';
    }

    if (value === '17:00:00') {
        return '05:00 pm';
    }

    if (value === '18:00:00') {
        return '06:00 pm';
    }

    if (value === '19:00:00') {
        return '07:00 pm';
    }

  }
}
