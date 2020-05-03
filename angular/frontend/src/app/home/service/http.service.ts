import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { member } from '../home.component';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  // MAESTRO_BASE_URL = 'https://t0cb6yv9dg.execute-api.us-east-1.amazonaws.com/prod';
  MAESTRO_BASE_URL = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  searchUserByNameLike (userName) {
    return this.http.get<member[]>(this.MAESTRO_BASE_URL + '/member/searchUserByNameLike/' + userName);
  }
}
