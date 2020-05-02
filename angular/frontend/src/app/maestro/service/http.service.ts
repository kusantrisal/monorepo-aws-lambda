import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, map, catchError, retry } from 'rxjs/operators';
import { Member } from '../model/member.model';

@Injectable({
  providedIn: 'root'
})

//NOTE withCredentials: false will add Bearer token to header
export class HttpService {
  // MAESTRO_BASE_URL = 'https://t0cb6yv9dg.execute-api.us-east-1.amazonaws.com/prod';
  MAESTRO_BASE_URL = 'http://localhost:3000';
  constructor(private http: HttpClient) { }


  getMember(): Observable<Member> {

    return this.http.get<Member>(this.MAESTRO_BASE_URL + '/member/getMember', { withCredentials: false, responseType: 'json', observe: 'response' })
      .pipe(
        //   tap(res => console.log(res)),
        map(res => res.body),
        retry(0),
        catchError(err => { console.log('GetMember Error'); return throwError(err); })
      );
  }


  createMember() {

    const header = new HttpHeaders()
      .set('Authorization', sessionStorage.getItem('access_token'))
      .set('Access-Control-Allow-Origin', '*');

    return this.http.post(this.MAESTRO_BASE_URL + '/member/createMember', { headers: header, withCredentials: true, responseType: 'json' });
  }

  updatemember(formControlName, value) {

    const body = new HttpParams()
      .set('key', formControlName)
      .set('value', value);

    return this.http.post(this.MAESTRO_BASE_URL + '/member/updateMemberValue', body, { withCredentials: false, responseType: 'json' });
  }

  getResourcesByMemberUuid() {
    return this.http.get(this.MAESTRO_BASE_URL + '/resource/getResourcesByMemberUuid', { withCredentials: false, responseType: 'json' });
  }

  addResource(file) {
    const fd = new FormData();
    fd.append('image', file);
    return this.http.post(this.MAESTRO_BASE_URL + '/resource/addResource', fd, { reportProgress: true, observe: 'events' });
  }

  deleteResource(resourceUuid) {
    const params = new HttpParams()
      .set('resourceUuid', resourceUuid);
    return this.http.delete(this.MAESTRO_BASE_URL + '/resource/deleteResource', { params: params });
  }

  makePublic(resourceUuid, allowAccess) {
    const body = new HttpParams()
      .set('resourceUuid', resourceUuid)
      .set('key', 'publicAccess')
      .set('value', allowAccess);

    return this.http.put(this.MAESTRO_BASE_URL + '/resource/makePublic', body);
  }

  //test only
  testApi(): Observable<Object> {
    console.log('Test API')

    const header = new HttpHeaders()
      .set('Access-Control-Allow-Origin', '*')
      .set('Name', 'Kush');

    //immutable so have to do the following
    let params = new HttpParams().append('age', '100');
    params = params.append('gender', 'male');

    //if withCredntials is true it wont add token in header
    return this.http.get('https://jsonplaceholder.typicode.com/users', { headers: header, params: params, withCredentials: true, responseType: 'json', observe: 'response' })
      .pipe(
        tap(res => console.log(res)),
        map(res => res.body),
        retry(),
        catchError(err => { console.log('need to come here'); return throwError(err); })
      );
  }
}
