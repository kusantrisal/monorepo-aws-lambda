import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { AuthService } from './../../service/auth/auth.service';
import { Member } from '../model/member.model';
import { Observable } from 'rxjs';
//import { memberStateResources } from '../state/member.state';
import { RemoveMember, AddResource } from '../actions/member.actions';
import { HttpService } from '../service/http.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { first } from 'rxjs/operators'
import { HttpEventType } from '@angular/common/http';
import { ThemePalette } from '@angular/material/core';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-resource',
  templateUrl: './resource.component.html',
  styleUrls: ['./resource.component.css']
})
export class ResourceComponent implements OnInit {

  @Select(state => state.member.resources) memberStateResources$;
  //OR use below line use use method from MemberStatus
  //@Select(memberStateResources.getMember) member$: Observable<Member>

  resources = [];
  selectedFile: File = null;
  value = 0;

  // checked = false;
  // indeterminate = false;
  // labelPosition: 'before' | 'after' = 'after';
  // disabled = false;

  constructor(public authService: AuthService,
    private _snackBar: MatSnackBar,
    private store: Store,
    private httpService: HttpService,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private router: Router,
    private sanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
    this.memberStateResources$.pipe(first()).subscribe(res => { console.log(res); if (res.length == 0) this.getResoucesByMemberUuid(); })

  }

  getResoucesByMemberUuid() {
    this.httpService.getResourcesByMemberUuid()
      .pipe(first())
      .subscribe(
        res => {
          this.resources.concat(res);
          this.addResourcesToStore(res);
        },
        err => console.log(err));

  }

  addResourcesToStore(resources) {
    resources.map(res => {
      let oldRes = res;
      oldRes.createDate = new Date(res.createDate)
      return oldRes;
    })
    this.store.dispatch([new AddResource(resources)]);
  }


  //file upload
  onFileSelected(event) {
    this.selectedFile = <File>event.target.files[0];
  }

  onSubmit(event) {
    console.log('Uploading file');
    console.log(event.target.files);
    this.value = 0;
    this.selectedFile = <File>event.target.files[0];

    if (this.selectedFile) {
      this.httpService.addResource(event.target.files).subscribe(
        events => {
          if (events.type === HttpEventType.UploadProgress) {
            //   console.log(Math.round(events.loaded / events.total * 100) + '%');
            this.value = Math.round(events.loaded / events.total * 100);

          } else if (events.type === HttpEventType.Response) {
            this._snackBar.open('File uploaded', 'Enjoy', {
              duration: 4000,
            });
            this.value = 0;
            this.getResoucesByMemberUuid();
          }

        }
      );
    }

  }

  public getSantizeUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  //sample to alter state
  removeMemberFromState() {
    this.store.dispatch([new RemoveMember()]);
  }
}
