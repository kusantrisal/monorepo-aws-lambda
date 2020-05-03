import { Pipe, PipeTransform } from '@angular/core';
import { message } from '../friend.component';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  tempValues: any[];
  transform(messages: message[], search: string): any {

    if (search == '') {
      return messages;
    }
    return messages.filter(mem => mem.from.toLowerCase().includes(search.toLowerCase()));
  }

}
