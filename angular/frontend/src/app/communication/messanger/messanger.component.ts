import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { WebSocketSubject } from 'rxjs/webSocket';

@Component({
  selector: 'app-messanger',
  templateUrl: './messanger.component.html',
  styleUrls: ['./messanger.component.css']
})
export class MessangerComponent implements OnInit, OnDestroy {

  ws = new WebSocketSubject({
    url: environment.CHAT_URL,
    protocol: [sessionStorage.getItem('access_token')]
  });

  socketOpen: boolean = true;

  constructor() { }


  ngOnInit(): void {
 //   this.connectWs();
  }

  ngOnDestroy(): void {
    console.log('page is being destroued')
    console.log(this.socketOpen)
    this.disconnectWs();
  }

  connectWs() {
    console.log('Connectecting to socket')
    this.ws.asObservable().subscribe(
      res => {
        console.log(res);
        this.socketOpen = true
      },
      err => {
        console.log("Something went wrong" + err);
        this.socketOpen = false;
      }
    );
    return this.socketOpen;
  }

  sendMsg() {

    try {
      if (this.socketOpen) {
        this.ws.next({ message: 'first' })
      }
      //reconnect
      else {
        this.connectWs();
        this.ws.next({ message: 'first' })
      }
    } catch (e) {
      //failed try once
      if (this.connectWs()) {
        try {
          this.ws.next({ message: 'first' })
        } catch (e) {
          console.log('Opps something is wrong');
        }

      } else {
        console.error('Unable to send message. Connection down')
      }
    }
  }

  disconnectWs() {
    if (this.socketOpen) {
      this.ws.complete();
      this.ws.unsubscribe();
    }
  }
}
