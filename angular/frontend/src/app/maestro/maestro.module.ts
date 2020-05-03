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
import { ImageComponent } from './content/image/image.component';
import { VideoComponent } from './content/video/video.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { FriendComponent } from './content/friend/friend.component';
import { FilterPipe } from './content/friend/pipe/filter.pipe';

@NgModule({
  declarations: [ProfileComponent, ResourceComponent, ImageComponent, VideoComponent, FriendComponent, FilterPipe],
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
