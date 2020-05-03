import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

export interface message {
  from: string;
  subject: string;
  content: string;
  profilePicPreSignedUrl: string;
}

@Component({
  selector: 'app-friend',
  templateUrl: './friend.component.html',
  styleUrls: ['./friend.component.css']
})
export class FriendComponent implements OnInit {

  search: string = '';
  friends: message[] = [];
  displayedColumns: string[];
  dataSource;
  constructor() { }

  ngOnInit(): void {

    this.displayedColumns = ['from', 'subject', 'content', 'profilePicPreSignedUrl'];
    this.friends.push({ from: 'Richa', subject: 'sub', content: 'con', profilePicPreSignedUrl: 'assets/images/lion.jpg' })
    this.friends.push({ from: 'Ranjit', subject: 'sub', content: 'con', profilePicPreSignedUrl: 'assets/images/lion.jpg' })
    this.friends.push({ from: 'Partap', subject: 'sub', content: 'con', profilePicPreSignedUrl: 'assets/images/lion.jpg' })
    this.friends.push({ from: 'Gudi', subject: 'sub', content: 'con', profilePicPreSignedUrl: 'assets/images/lion.jpg' })
    //   this.dataSource = new MatTableDataSource(this.friends);
  }


  applyFilterOnFriendsList(event: Event) {
    this.search = (event.target as HTMLInputElement).value;
  }
}
