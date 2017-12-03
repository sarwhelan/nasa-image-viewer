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

  constructor(private http: HttpClient) { }

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

  setCurrentUser(username:string){
      var d:Date = new Date();
      d.setTime(d.getTime() + (24*60*60*1000));
      var expires:string = "expires="+d.toUTCString();
      document.cookie = "user=" + username + ";" + expires + ";path=/";
  }

  getCurrentUser() {
      var name:string = "user=";
      // Get name portion of cookie
      let ca = document.cookie.split(';');
      for(var i = 0; i < ca.length; i++) {
          var c = ca[i];
          while (c.charAt(0)==' ') {
              c = c.substring(1);
          }
          if (c.indexOf(name) == 0) {
              console.log(c.substring(name.length,c.length));
              return c.substring(name.length,c.length);
          }
      }
      return "";
  }

  login(email:string, password:string) {
    var userInfo = {
      'username': email,
      'password': password
    }
    return this.http.post('http://localhost:8080/api/login', userInfo)
      .map((res:any) => {
        if(res.msg == "success") {
          this.loggedIn = true;
          this.currentUser = userInfo.username;
          return true;
        }
        return false;
      })
  }

  logOut(){
      document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
  }

}
