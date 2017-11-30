import { Component, OnInit } from '@angular/core';
import { Injector } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from "@angular/common/http";
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  emailSent = false;
  userServ;
  error = false;
  router;

  constructor(rt: Router, userService: UserService, cm: CommonModule) {
    this.router = rt;
    this.userServ = userService;
  }

  ngOnInit() {
  }

  register(email:string, password:string) {
    console.log(email + " " + password);
    this.userServ.createUser(email, password, this.callBackFunction);
  }

  callBackFunction(res: string) {
    console.log("in callback function, register component:" + res);
    if(res)
      this.emailSent = true;
    else
      this.error = true;
  }

}
