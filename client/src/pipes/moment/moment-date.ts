import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'momentDate'
})
export class MomentDatePipe implements PipeTransform {
  transform(value: Date | any, ...args: any[]): any {
    if (!value) {
      return null;
    }
    // Assuming the number is epoch based
    if (typeof value == 'number') {
      value = moment.unix(value);
    }
    return moment(value).calendar();
    // return moment(value).format('LLL');
  }
}