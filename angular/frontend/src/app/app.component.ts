import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from './service/auth/auth.service';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { Subscription } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { first } from 'rxjs/operators'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  @Select(state => state.member) memberState$;

  memberInfoLoadedFromMaestro = 'Z';
  profilePicPreSignedUrl = '';
  title = 'zerotoheroquick-frontend';
  mediaSub: Subscription;
  screenSize: string;
  deviceXs: boolean;

  constructor(public authService: AuthService, public mediaObserver: MediaObserver, private store: Store) { }

  ngOnInit() {

    this.memberState$
      .subscribe(
        mem => {
          console.log(mem)
          this.memberInfoLoadedFromMaestro = mem.username.charAt(0).toUpperCase();
          this.profilePicPreSignedUrl = mem.member.profilePicPreSignedUrl;
        });
    this.mediaSub = this.mediaObserver.media$.subscribe((result: MediaChange) => {
      //  console.log(result.mqAlias)
      this.screenSize = result.mqAlias;
      this.deviceXs = result.mqAlias === 'xs' ? true : false;
    })
  }

  ngOnDestroy() {
    this.mediaSub.unsubscribe();
  }

}
