import { Pipe, PipeTransform } from '@angular/core';
import { friend } from '../friend.component';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  tempValues: any[];
  transform(friends: friend[], search: string): any {

    if (search == '') {
      return friends;
    }
    return friends.filter(mem => mem.firstName.toLowerCase().includes(search.toLowerCase()));
  }

}
