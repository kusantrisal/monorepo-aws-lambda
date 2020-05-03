import { Component, OnInit, Inject } from '@angular/core';
import { HttpService } from '../../service/http.service';
import { HttpEventType, HttpEvent, HttpClient } from '@angular/common/http';
import { AddResource, UpdateResource, DeleteResource, RefreshResource } from '../../actions/member.actions';
import { Store, Select } from '@ngxs/store';
import { MatSnackBar } from '@angular/material/snack-bar';
import { first } from 'rxjs/operators';
import { MediaObserver } from '@angular/flex-layout';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { of, combineLatest, forkJoin } from 'rxjs';
import { map, mergeAll } from 'rxjs/operators';
import { FormBuilder, Validators } from '@angular/forms';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';

export interface DialogData {
  url: string;
  createDate: string;
}


@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})
export class ImageComponent implements OnInit {

  @Select(state => state.member.resources) memberStateResources$;

  files: File[] = [];
  uploadedPercent = 0;
  images = [];
  screenSize: string;
  formGroup = this.fb.group({
    resourceUuid: [null, Validators.required],
    description: [null, Validators.required]
  });
  constructor(
    private httpService: HttpService,
    private store: Store,
    private _snackBar: MatSnackBar,
    private mediaObserver: MediaObserver,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private _bottomSheet: MatBottomSheet
  ) { }

  ngOnInit(): void {
    this.mediaObserver.asObservable().subscribe(
      change => {
        change.forEach((v) => {
          this.screenSize = v.mqAlias;
        });
      });
    this.getResoucesByMemberUuid();
  }

  openBottomSheet(): void {
    this._bottomSheet.open(BottomSheetOverviewExampleSheet);
  }

  onSelect(event) {
    //console.log(event);
    this.files.push(...event.addedFiles);
  }

  onRemove(event) {
   // console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

  delete(resourceUuid) {
    //console.log(resourceUuid);
    this.httpService.deleteResource(resourceUuid).subscribe(
      res => {
        this.store.dispatch([new DeleteResource(res)]);
      },
      err => console.log(err)
    );
  }

  makePublic(resourceUuid, allowAccess) {
   // console.log(resourceUuid);
    this.httpService.makePublic(resourceUuid, allowAccess).subscribe(
      res => {
        // res['createDate'] = new Date(res['createDate'])
        this.store.dispatch([new UpdateResource(res)]);
      },
      err => console.log(err)
    );
  }

  onSubmit() {

    let combine = [];
    this.uploadedPercent = 0;

    if (this.files.length > 0) {
      this.files.forEach(file => {
        combine.push(this.httpService.addResource(file));
      });

      forkJoin(combine).subscribe(
        events => {
          let uploaded = [];
          let failed = [];

          events.forEach(event => {
            console.log(event['status'])
            if (event['status'] == '200') {
              uploaded.push(event['body'][0]);

            } else {
              failed.push(event['body'][0]);
            }
          });

          if (uploaded.length > 0) {
            this._snackBar.open('Files uploaded', 'Successful', {
              duration: 4000,
            });
          }

          if (failed.length > 0) {
            this._snackBar.open('Failed to load', 'Failed', {
              duration: 4000,
            });
          }


          this.files = [];

          this.store.dispatch([new AddResource(uploaded)]);
          this.getResoucesByMemberUuid();
          // {
          //   if (events.type === HttpEventType.UploadProgress) {
          //     //   console.log(Math.round(events.loaded / events.total * 100) + '%');
          //     this.uploadedPercent = Math.round(events.loaded / events.total * 100);

          //   } else if (events.type === HttpEventType.Response) {
          //     this._snackBar.open('File uploaded', 'Enjoy', {
          //       duration: 4000,
          //     });
          //     this.files = [];
          //     this.uploadedPercent = 0;
          //     this.getResoucesByMemberUuid();
          //   }

          // }
        },
        err => console.log(err)
      );
      //  console.log(observablesList)
    }
  }

  getResoucesByMemberUuid() {
    this.httpService.getResourcesByMemberUuid()
      .pipe(first())
      .subscribe(
        res => {
          this.images.concat(res);
          this.addResourcesToStore(res);
        },
        err => console.log(err));

  }

  addResourcesToStore(resources) {
    // resources.map(res => {
    //   let oldRes = res;
    //   oldRes.createDate = new Date(res.createDate)
    //   return oldRes;
    // })
    this.store.dispatch([new RefreshResource(resources)]);
  }

  animal: string;
  name: string;

  openDialog(resource): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: 'auto',
      height: 'auto',
      data: { url: resource.preSignedUrlForOriginal, createDate: resource.createDate }
    });

    dialogRef.afterClosed().subscribe(result => {
    //  console.log('The dialog was closed');
      this.animal = result;
    });
  }

  //unused
  formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
})
export class DialogOverviewExampleDialog {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'bottom-sheet-overview-example-sheet',
  templateUrl: 'bottom-sheet-overview-example-sheet.html',
})
export class BottomSheetOverviewExampleSheet {
  constructor(private _bottomSheetRef: MatBottomSheetRef<BottomSheetOverviewExampleSheet>) {}

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
}