import { Component, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { HttpService } from '../../service/http.service';
import { first } from 'rxjs/operators';

export interface friend {
  memberUuid: string;
  firstName: string;
  lastName: string;
  status: string;
}

@Component({
  selector: 'app-friend',
  templateUrl: './friend.component.html',
  styleUrls: ['./friend.component.css']
})
export class FriendComponent implements OnInit {

  @Select(state => state.member) memberState$;

  search: string = '';
  friends: friend[] = [];
  displayedColumns: string[];
  dataSource;
  constructor(private store: Store, private httpService: HttpService) { }

  ngOnInit(): void {
    this.memberState$
      .pipe(first())
      .subscribe(
        mem => {
          //   console.log(mem.member.friends)
          if (mem.member.friends) {

            for (const f of mem.member.friends) {
              //TODO convert bucket and key name to url
              f.profilePicUrl = 'https://' + f.profilePic.bucket + '.s3.amazonaws.com/'+ f.profilePic.key;
              this.friends.push(f)
            }
          }
        });
  }


  applyFilterOnFriendsList(event: Event) {
    this.search = (event.target as HTMLInputElement).value;
  }
}
