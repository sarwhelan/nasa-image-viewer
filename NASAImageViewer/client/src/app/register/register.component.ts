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

  userServ;
  router;
  emailSent = false;
  success = false;
  taken = false;
  error = false;
  noEmail = false;
  noPass = false;
  invalidEmail = false;

  constructor(rt: Router, userService: UserService, cm: CommonModule) {
    this.router = rt;
    this.userServ = userService;
  }

  ngOnInit() {
  }

  register(email:string, password:string) {
    console.log(email + " " + password);
    
    // reset each time register is called...
    this.emailSent = false;
    this.error = false;
    this.success = false;
    this.taken = false;
    this.noEmail = false;
    this.noPass = false;
    this.invalidEmail = false;
    // -------------------------------------

    if(email == '' || email == ' ') {
      this.noEmail = true;
      return;
    }
    if(password == '' || password == ' ') {
      this.noPass = true;
      return;
    }

    this.userServ.createUser(email, password).subscribe(result => {
      if(result.msg == "success") {
        this.success = true; // to display pop up
        console.log("successsss");
      }
      else if(result.msg == "taken") {
        this.taken = true;
        console.log("taken");
      }
      else if(result.msg == "invalidEmail") {
        this.invalidEmail = true;
        console.log("invalid");
      }
      else {
        this.error = true;
        console.log("error!!!");
      }
    })
  }

  /*
  callBackFunction(res: string) {
    console.log("in callback function, register component:" + res);
    if(res)
      this.emailSent = true;
    else
      this.error = true;
  }
  */

  /*
  login(email:string, password:string) { // called from HTML submit button click
    // call /api/login and send parameters
    // if login successful, redirect to their collections
    // redirect to
    // now we call the user service to help
    this.userServ.login(email, password).subscribe(result => {
      if(result) { // result is either TRUE if successful or UNDEFINED if unsuccessful
        this.router.navigateByUrl('/collections');
        console.log("success in login component");
      } else {
        console.log("unsuccessful in login component");
        this.loginError = true;
      }

    });
  }
  */

}
