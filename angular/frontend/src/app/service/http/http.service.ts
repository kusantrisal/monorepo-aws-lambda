import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class HttpService {
  AUTH_SERVER_BASE_URL = 'http://localhost:8081';
  clientId = 'app';
  clientSecret = 'pass';
  constructor(private http: HttpClient) { }

  signIn(userData) {

    const header = new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Access-Control-Allow-Origin', '*')
      .set('Authorization', 'Basic ' + btoa(this.clientId + ':' + this.clientSecret));

    const body = new HttpParams()
      .set('username', userData.value.username)
      .set('password', userData.value.password)
      .set('grant_type', userData.value.grantType);

    return this.http.post<any>(this.AUTH_SERVER_BASE_URL + '/auth/oauth/token', body, { headers: header, withCredentials: true, responseType: 'json' });
  }

  checkToken() {
    return this.http.get(this.AUTH_SERVER_BASE_URL + '/auth/oauth/check_token?token=' + sessionStorage.getItem('access_token'));
  }

  refreshToken() {
    console.log('Token refresh api is being called');
    const header = new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Access-Control-Allow-Origin', '*');
    //  .set('Authorization', 'Basic ' + btoa(this.clientId + ':' + this.clientSecret));

    const body = new HttpParams()
      .set('client_id', this.clientId)
      .set('client_secret', this.clientSecret)
      .set('grant_type', 'refresh_token')
      .set('refresh_token', sessionStorage.getItem('refresh_token'));

    return this.http.post<any>(this.AUTH_SERVER_BASE_URL + '/auth/oauth/token', body, { headers: header, withCredentials: true, responseType: 'json' });
  }

  getUser() {
    return this.http.get('http://localhost:8082/resource2/secure');
  }

}
