import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { MessangerComponent } from '../communication/messanger/messanger.component';
import { CommunicationModule } from '../communication/communication.module';


@NgModule({
  declarations: [SigninComponent, SignupComponent],
  imports: [
    CommonModule,
    CommunicationModule
  ]
})
export class AuthModule { }
