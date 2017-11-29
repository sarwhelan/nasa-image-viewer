import { Component, OnInit } from '@angular/core';
import { Injector } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from "@angular/common/http";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  userServ;

  constructor(private router: Router, userService: UserService) {
    this.router = router;
    this.userServ = userService;
  }

  ngOnInit() { }

  login(email:string, password:string) { // called from HTML submit button click
    // call /api/login and send parameters
    // if login successful, redirect to their collections
    // redirect to
    // now we call the user service to help
    this.userServ.login(email, password).subscribe((result) => {
    if (result) {
      this.router.navigateByUrl('/collections', email);
    }
  });
  }

}
