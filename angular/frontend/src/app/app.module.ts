import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule, routingCompoments } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SecureComponent } from './secure/secure.component';
import { AuthGuard } from './service/guard/auth.guard';
import { AuthService } from './service/auth/auth.service';
import { InterceptorService } from './service/http-interceptor/interceptor.service';
import { HomeComponent } from './home/home.component';
import { FormsModule } from '@angular/forms';
import { MaestroModule } from './maestro/maestro.module';
import { CommunicationModule } from './communication/communication.module';


@NgModule({
  declarations: [
    AppComponent,
    routingCompoments,
    SecureComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    MaestroModule,
    CommunicationModule
  ],
  providers: [AuthService, AuthGuard, {provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true}],
  bootstrap: [AppComponent],
  exports: [
    MaterialModule
  ]
})
export class AppModule { }
