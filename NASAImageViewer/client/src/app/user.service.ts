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
  private pass="";

  constructor(private http: HttpClient) {
    this.loggedIn = !!localStorage.getItem('auth_token');
  }

  createUser(email:string, password:string, callBackFunction) {
    console.log("in createUser, userService: " + this.email + " " + this.pass);

    var userInfo = {
      'username': email,
      'password': password,
      'type': "register"
    }

    return this.http.post('http://localhost:8080/api/register', userInfo)
      .map((res: any) => {
        if(res.success) {
          console.log("successful registration");
        }
        else {
          console.log("unsuccessful registration");
        }
      })

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
  }

  /*private extractMsg(res: Response) {
      let body;
      if (1) { // only get json if text exists
          body = res.json();
      }
      return body || {};
  */

  login(email:string, password:string) {
    console.log("in login() within user service");
    var userInfo = {
      'username': email,
      'password': password
    }
    return this.http.post('http://localhost:8080/api/login', userInfo)
      .map((res:any) => {
        if(res.success == "true") {
          localStorage.setItem('auth_token', res.auth_token);
          this.loggedIn = true;
          this.email = email;
        }
        return res.success;
      })
  }

  logout() {
    this.loggedIn = false;
    this.email = "";
  }

  setCurrentUser(username:string) {
    this.email = username;
  }



}
