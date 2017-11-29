import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpModule } from '@angular/http';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class UserService {

  private loggedIn = false;
  private email = "";

  constructor(private http: HttpClient) {
    this.loggedIn = !!localStorage.getItem('auth_token');
  }

  createUser(email:string, password:string) {
    var userInfo = {
      'userName': email,
      'password': password
    }

    return this.http.post('/register', userInfo).map(this.extractMsg);
  }

  private extractMsg(res: Response) {
      let body;
      if (res.text()) { // only get json if text exists
          body = res.json();
      }
      return body || {};
  }

  login(email:string, password:string) {
    console.log("in login() userservice");
    var userInfo = {
      'userName': email,
      'password': password
    }
    return this.http.post('/api/login', userInfo)
      .map((res: any) => {
        if (res.success) { // if sucessfully logged in
          localStorage.setItem('auth_token', res.auth_token);
          this.loggedIn = true;
          this.email = email; // use to get their collections
          return res.success;
        }
      });
  }



}
