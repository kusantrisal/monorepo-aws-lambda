import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile/profile.component';
import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { MemberState } from './state/member.state';
import { ResourceComponent } from './resource/resource.component';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { ImageComponent } from './media/image/image.component';
import { VideoComponent } from './media/video/video.component';
import { NgxDropzoneModule } from 'ngx-dropzone';


@NgModule({
  declarations: [ProfileComponent, ResourceComponent, ImageComponent, VideoComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    NgxDropzoneModule,
    FormsModule,
    NgxsModule.forRoot([
      MemberState
    ]),
    NgxsReduxDevtoolsPluginModule.forRoot(),
  ],
  exports: [
    ProfileComponent
  ]
})
export class MaestroModule { }
