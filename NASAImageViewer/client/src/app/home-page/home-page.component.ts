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
  collections = []; // for loading top 10 in ngOnInit()
  imgs = [];
  readyToDisplay = false;
  ready = false;
  collName;

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

  getImgsInCollection(cID: String) {
    var x;
    // sending the _id value of a collection to load-user-collection service
    this.collectionServ.getCertainCollection(cID)
      .subscribe(result => {
        console.log(result);
        this.collName = result[0].name;
        x = (result[0].img).substr(1);
        x = x.slice(0, -1);
        this.imgs = (x).split(",");
        this.ready = true;
      })
  }



}
