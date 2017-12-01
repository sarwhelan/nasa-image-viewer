import { Component, OnInit } from '@angular/core';
import { Injector } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { LoadUserCollectionsService } from '../load-user-collections.service';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from "@angular/common/http";
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/from';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  router;
  collectionServ;
  collections = [];
  readyToDisplay = false;

  constructor(r: Router, collectionS: LoadUserCollectionsService) {
    this.router = r;
    this.collectionServ = collectionS;
  }

  ngOnInit() { // show collections on initialization
    this.collectionServ.getTopTen()
      .subscribe(result => {
        this.collections = result;
      });
      this.readyToDisplay = true;
  }



}
