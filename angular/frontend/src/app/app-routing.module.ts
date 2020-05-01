import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SigninComponent } from './auth/signin/signin.component';
import { SignupComponent } from './auth/signup/signup.component';
import { SecureComponent } from './secure/secure.component';
import { ProfileComponent } from './maestro/profile/profile.component';
import { AuthGuard } from './service/guard/auth.guard';
import { HomeComponent } from './home/home.component';
import { ResourceComponent } from './maestro/resource/resource.component';
import { MessangerComponent } from './communication/messanger/messanger.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'message', component: MessangerComponent },
  { path: 'secure', component: SecureComponent, canActivate: [AuthGuard] },
  { path: 'maestro', component: ProfileComponent, canActivate: [AuthGuard] },
  //{ path: 'maestro/resource', component: ResourceComponent, canActivate: [AuthGuard] },
  { path: 'signin', component: SigninComponent },
  { path: 'signup', component: SignupComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingCompoments = [SigninComponent, SignupComponent];
