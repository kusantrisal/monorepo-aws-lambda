import { Injectable, OnInit } from '@angular/core';
import { HttpService } from '../http/http.service';
import { Router } from '@angular/router';
import { StorageService } from '../storage/storage.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpService: HttpService,
    private router: Router,
    private storageService: StorageService
  ) {

  }

  isAuthenticated() {
    // console.log(new Date(localStorage.getItem('expires')).toLocaleString('en-US', {timeZone: 'America/New_York'}));
    // console.log(new Date().toLocaleString('en-US', {timeZone: 'America/New_York'}));
    // console.log(new Date(localStorage.getItem('expires')) > new Date());
    return !!sessionStorage.getItem('access_token');
    //  && new Date(localStorage.getItem('expires')) > new Date();
  }

  refreshToken() {
    return this.httpService.refreshToken();
  }

  logout() {
    this.storageService.removeTokenFromSessionStorage();
    this.router.navigate(['/home']);
  }
}
