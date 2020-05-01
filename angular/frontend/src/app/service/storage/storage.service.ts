import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  saveTokenInSessionStorage(accessToken, refreshToken, expires) {
    sessionStorage.setItem('access_token', accessToken);
    sessionStorage.setItem('refresh_token', refreshToken);
    sessionStorage.setItem('expires', expires);
  }

  removeTokenFromSessionStorage() {
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
    sessionStorage.removeItem('expires');
  }

  saveTokenInLocalStorage(accessToken, refreshToken, expires) {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    localStorage.setItem('expires', expires);
  }

  removeTokenFromLocalStorage() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('expires');
  }



}
