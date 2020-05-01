import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from './service/auth/auth.service';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'zerotoheroquick-frontend';
  mediaSub: Subscription;
  screenSize: string;
  deviceXs: boolean;

  constructor(public authService: AuthService, public mediaObserver: MediaObserver) { }

  ngOnInit() {
    this.mediaSub = this.mediaObserver.media$.subscribe((result: MediaChange) => {
      console.log(result.mqAlias)
      this.screenSize = result.mqAlias;
      this.deviceXs = result.mqAlias === 'xs' ? true : false;
    })
  }

  ngOnDestroy() {
    this.mediaSub.unsubscribe();
  }

}
