import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpModule } from '@angular/http';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/from';

@Injectable()
export class UserService {

  private loggedIn = false;
  private email = "";
  private pass= "";
  currentUser;

  constructor(private http: HttpClient) {
    this.loggedIn = !!localStorage.getItem('auth_token');
  }

  createUser(email:string, password:string) {
    this.email = email;
    this.pass = password;
    console.log("in createUser, userService: " + this.email + " " + this.pass);

    var userInfo = {
      'username': this.email,
      'password': this.pass,
      'type': 'register'
    }

    return this.http.post('http://localhost:8080/api/register', userInfo)
      .map((res: any) => {
        return res;
      })
    }

    /*
      fetch('http://localhost:8080/api/register', {
      method: 'post',
      headers: {'Content-type':'application-json'},
      body: JSON.stringify({username: this.email, password: this.pass, type: 'register'})
    }).then(function(response){
      console.log("response: " + response['msg']);
      callBackFunction(response['msg']);
    }).catch(function () {
      console.log("error in createUser, userService");
    })
    */


  /*private extractMsg(res: Response) {
      let body;
      if (1) { // only get json if text exists
          body = res.json();
      }
      return body || {};
  */

  userLoggedIn() {
    if (this.loggedIn) {
      console.log(this.currentUser);
      return this.currentUser;
    }
    else
      return null;
  }

  login(email:string, password:string) {
    console.log("in login() within user service");
    var userInfo = {
      'username': email,
      'password': password
    }
    return this.http.post('http://localhost:8080/api/login', userInfo)
      .map((res:any) => {
        if(res.msg == "success") {
          localStorage.setItem('auth_token', res.auth_token);
          this.loggedIn = true;
          this.currentUser = userInfo.username;
          console.log(this.userLoggedIn());
          return true;
        }
        console.log(this.userLoggedIn());
        return false;
      })
  }

  logout() {
    this.loggedIn = false;
    this.email = "";
  }

}
