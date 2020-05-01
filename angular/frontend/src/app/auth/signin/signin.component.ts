import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validator, Validators } from '@angular/forms';
import { HttpService } from 'src/app/service/http/http.service';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/service/storage/storage.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  constructor(private fb: FormBuilder, private httpService: HttpService, private router: Router, private storageService: StorageService) { }

  loginForm = this.fb.group({
    username: ['kush', Validators.required],
    password: ['pass'],
    grantType: ['password']
  });

  ngOnInit(): void { }

  signIn() {
    this.httpService.signIn(this.loginForm).subscribe(res => {
      this.storageService.saveTokenInSessionStorage(res.access_token, res.refresh_token, res.expires);
      this.router.navigate(['/maestro']);
    }, err => {
      console.error(err);
    });
  }

}
