import { Component, OnInit } from '@angular/core';
import { Injector } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from "@angular/common/http";
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/from';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  userServ;
  loginError = false;
  noPass = false;
  noEmail = false;

  constructor(private router: Router, userService: UserService, cm: CommonModule) {
    this.router = router;
    this.userServ = userService;
  }

  ngOnInit() {
    this.userServ.logOut();
  }

  login(email:string, password:string) {
    this.loginError = false;
    this.noPass = false;
    this.noEmail = false;

    if(email == '' || email == ' ') {
      this.noEmail = true;
      return;
    }
    if(password == '' || password == ' ') {
      this.noPass = true;
      return;
    }

    this.userServ.login(email, password).subscribe(result => {
      if(result) {
        this.userServ.setCurrentUser(email);
        this.router.navigateByUrl('/collections');
      } else {
          this.loginError = true;
        }
    });
  }

}
