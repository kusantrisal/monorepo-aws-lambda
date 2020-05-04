import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpService } from './service/http.service';
import { AuthService } from '../service/auth/auth.service';
import { Select, Store } from '@ngxs/store';
import { templateVisitAll } from '@angular/compiler';

export interface member {
  lastName: string;
  firstName: string;
  memberUuid: string;
  profilePicUrl: string;
  status: string;
  profilePic: {
    bucket: string;
    key: string
  };
}

export interface friend {
  memberUuid: string;
  firstName: string;
  lastName: string;
  status: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  @Select(state => state.member) memberState$;

  members: member[] = [];
  friends: friend[] = [];
  searchForm = this.fb.group({
    searchName: [null, Validators.required]
  });
  constructor(
    private fb: FormBuilder,
    private httpService: HttpService,
    public authService: AuthService,
    private store: Store) { }

  ngOnInit(): void {
    this.memberState$
      .subscribe(
        mem => {
          if (mem.member.friends) {
            for (const f of mem.member.friends) {
              f.profilePicUrl = 'https://' + f.profilePic.bucket + '.s3.amazonaws.com/' + f.profilePic.key;
              this.friends.push(f)
            }
          }
        });
  }

  search() {
    this.httpService.searchUserByNameLike(this.searchForm.value.searchName).subscribe(
      res => {
        let tempList: member[] = [];
        res.forEach(mem => {
          mem.profilePicUrl = 'https://' + mem.profilePic.bucket + '.s3.amazonaws.com/' + mem.profilePic.key;
          if (this.friends && this.friends.length > 0) {
            let matchedMembers = this.friends.filter(f => f.memberUuid == mem.memberUuid);
            mem.status = matchedMembers.length > 0 ? matchedMembers[0].status : '';
          }
          tempList.push(mem);
        });
        this.members = tempList;
      },
      err => console.log(err)
    );
  }

  sendFriendRequest(memberUuid) {
    this.httpService.sendFriendRequest(memberUuid).subscribe(
      res => {
        console.log(res)
      },
      err => console.log(err)
    );
  }
}
