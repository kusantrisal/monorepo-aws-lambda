import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpService } from './service/http.service';

export interface member {
  lastName: string;
  firstName: string;
  memberUuid: string;
  profilePicPreSignedUrl: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  members: member[];
  displayedColumns: string[];
  dataSource;
  searchForm = this.fb.group({
    searchName: [null, Validators.required]
  });
  constructor(private fb: FormBuilder, private httpService: HttpService) { }
  ngOnInit(): void {
    this.displayedColumns = ['from', 'subject', 'content', 'profilePicPreSignedUrl'];
    // this.friends.push({ from: 'Richa', subject: 'sub', content: 'con', profilePicPreSignedUrl: 'assets/images/lion.jpg' })
    // this.friends.push({ from: 'Ranjit Risal', subject: 'Online', content: 'con', profilePicPreSignedUrl: 'assets/images/lion.jpg' })
    // this.friends.push({ from: 'Partap Risal', subject: 'sub', content: 'con', profilePicPreSignedUrl: 'assets/images/lion.jpg' })
    // this.friends.push({ from: 'Gudi Risal', subject: 'sub', content: 'con', profilePicPreSignedUrl: 'assets/images/lion.jpg' })
    // this.friends.push({ from: 'Richa', subject: 'sub', content: 'con', profilePicPreSignedUrl: 'assets/images/lion.jpg' })
    // this.friends.push({ from: 'Ranjit', subject: 'sub', content: 'con', profilePicPreSignedUrl: 'assets/images/lion.jpg' })
    // this.friends.push({ from: 'Partap', subject: 'sub', content: 'con', profilePicPreSignedUrl: 'assets/images/lion.jpg' })
    // this.friends.push({ from: 'Gudi', subject: 'sub', content: 'con', profilePicPreSignedUrl: 'assets/images/lion.jpg' })
    // this.friends.push({ from: 'Richa', subject: 'sub', content: 'con', profilePicPreSignedUrl: 'assets/images/lion.jpg' })
    // this.friends.push({ from: 'Ranjit', subject: 'sub', content: 'con', profilePicPreSignedUrl: 'assets/images/lion.jpg' })
    // this.friends.push({ from: 'Partap', subject: 'sub', content: 'con', profilePicPreSignedUrl: 'assets/images/lion.jpg' })
    // this.friends.push({ from: 'Gudi', subject: 'sub', content: 'con', profilePicPreSignedUrl: 'assets/images/lion.jpg' })
  }

  search() {
    this.httpService.searchUserByNameLike(this.searchForm.value.searchName).subscribe(
      res => {
        console.log(res)
        this.members = res ;
        console.log(this.members)

      },
      err => console.log(err)
    );
  }
}
