import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessangerComponent } from './messanger/messanger.component';
import { AuthService } from '../service/auth/auth.service';



@NgModule({
  declarations: [ MessangerComponent],
  imports: [
    CommonModule
  ],
  providers:[AuthService],
  exports: [
    MessangerComponent
  ]
})
export class CommunicationModule { }
