import { Component, OnInit, Input } from '@angular/core';
import { HttpService } from '../service/http.service';
import { AddMember } from '../actions/member.actions';
import { Router } from "@angular/router";
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { first } from 'rxjs/operators'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  showResourcesFlag: boolean;
  memberInfo = {};

  @Select(state => state.member) memberState$;
  @Select(state => state.member.resources) memberStateResources$;
  formGroup = this.fb.group({
    email: [null, Validators.required],
    phone: [null, Validators.required]
  });

  constructor(private httpService: HttpService, private store: Store, private router: Router, private sanitizer: DomSanitizer, private fb: FormBuilder) { }

  ngOnInit(): void {
    //check if member is in store if its there use data from there else make api call
    //create user in maestro portal if it doesn't exist already
    this.getMember(true);

    //disable all form group initially
    this.disableFormGroup();
  }

  public getSantizeUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  edit(formControlName) {

    for (const control in this.formGroup.controls) {
      if (control === formControlName) {
        this.formGroup.controls[control].enable();
      } else {
        this.formGroup.controls[control].disable();
        this.memberState$
          .pipe(first())
          .subscribe(
            mem => {
              this.formGroup.get(control).setValue(mem.member[control]);
            });
      }
    }
  }

  save(formControlName) {
    this.httpService.updatemember(formControlName, this.formGroup.get(formControlName).value).subscribe(res => {
      this.getMember(true);
      this.disableFormGroup();
    },
      err => console.log(err));
  }

  showResources() {
    this.showResourcesFlag = !this.showResourcesFlag;
    //  this.router.navigate(["/maestro/resource"]);
  }

  disableFormGroup() {
    for (var control in this.formGroup.controls) {
      this.formGroup.controls[control].disable();
    }
  }

  getMember(forceGetMember) {
    this.memberState$
      .pipe(first())
      .subscribe(
        mem => {
          if ((mem.member.memberUuid === null || mem.member.memberUuid === '') || forceGetMember) {
            this.httpService.getMember().subscribe(
              res => {
                this.memberInfo = res;
                this.formGroup.setValue({
                  email: this.memberInfo['email'],
                  phone: this.memberInfo['phone']
                });
                this.addMemberToStore(res);
              },
              //if the member doesn't exist create member
              err => {
                console.log("Creating member for the first time")
                this.httpService.createMember().subscribe(
                  res => {
                    this.memberInfo = res;
                    this.formGroup.setValue({
                      email: this.memberInfo['email'],
                      phone: this.memberInfo['phone']
                    });
                    this.addMemberToStore(res);
                  },
                  err => console.log(err))
              });

          } else {
            this.memberInfo = mem.member;
            this.formGroup.setValue({
              email: mem.member.email,
              phone: mem.member.phone
            });
          }
        })

  }

  addMemberToStore(member) {
    this.store.dispatch([new AddMember(member)]);
  }
}
