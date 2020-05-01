import { Component, OnInit, Inject } from '@angular/core';
import { HttpService } from '../../service/http.service';
import { HttpEventType } from '@angular/common/http';
import { AddResource } from '../../actions/member.actions';
import { Store, Select } from '@ngxs/store';
import { MatSnackBar } from '@angular/material/snack-bar';
import { first } from 'rxjs/operators';
import { MediaObserver } from '@angular/flex-layout';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

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
  constructor(
    private httpService: HttpService,
    private store: Store,
    private _snackBar: MatSnackBar,
    private mediaObserver: MediaObserver,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.mediaObserver.asObservable().subscribe(
      change => {
        change.forEach((v) => {
          this.screenSize= v.mqAlias;
        });
      });
    this.getResoucesByMemberUuid();
  }

  onSelect(event) {
    console.log(event);
    this.files.push(...event.addedFiles);
  }

  onRemove(event) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }
  delete(resourceUuid) {
    console.log(resourceUuid);
    this.httpService.deleteResource(resourceUuid).subscribe(
      res => this.getResoucesByMemberUuid(),
      err => console.log(err)
    );
  }
  onSubmit() {
    this.uploadedPercent = 0;
    if (this.files.length > 0) {
      this.httpService.addResource(this.files).subscribe(
        events => {
          if (events.type === HttpEventType.UploadProgress) {
            //   console.log(Math.round(events.loaded / events.total * 100) + '%');
            this.uploadedPercent = Math.round(events.loaded / events.total * 100);

          } else if (events.type === HttpEventType.Response) {
            this._snackBar.open('File uploaded', 'Enjoy', {
              duration: 4000,
            });
            this.files = [];
            this.uploadedPercent = 0;
            this.getResoucesByMemberUuid();
          }

        }
      );
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
    resources.map(res => {
      let oldRes = res;
      oldRes.createDate = new Date(res.createDate)
      return oldRes;
    })
    this.store.dispatch([new AddResource(resources)]);
  }

  animal: string;
  name: string;

  openDialog(resource): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: 'auto',
      height: 'auto',
      data: { url: resource.preSignedUrlForOriginal, createDate: resource.createDate}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
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
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}