import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'fromNow'
})
export class FromNowPipe implements PipeTransform {
  transform(value: Date | any, ...args: any[]): any {
    if (!value) {
      return null;
    }
    // Assuming the number is epoch based
    if (typeof value == 'number') {
      value = moment.unix(value);
    }
    if (Math.abs(moment().diff(value)) < 55000) { // 1000 milliseconds
      return 'just now';
    }
    return moment(value).fromNow();
  }
}