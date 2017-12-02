import { Component, OnInit } from '@angular/core';
import { Injector } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from "@angular/common/http";
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LoadUserCollectionsService } from '../load-user-collections.service';
import { RetrieveImagesService} from '../retrieve-images.service';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.css']
})
export class CollectionsComponent implements OnInit {

  currentUser;
  router;
  userServ;
  collectionServ;
  searchServ;
  currUser;
  canAccess = true;
  usersColl = [];
  readyToDisplay = false; // used for showing collections made by the user
  none = false;
  collName;
  ready;

  constructor(rt: Router, userService: UserService, cm: CommonModule, collServ: LoadUserCollectionsService, searchS: RetrieveImagesService) {
    this.router = rt;
    this.userServ = userService;
    this.collectionServ = collServ;
    this.searchServ = searchS;
  }

  getImagesInCollection(id:String) {
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

  ngOnInit() { // on init, get this users collections
    this.currUser = this.userServ.getCurrentUser();
    if(this.currUser == "") {
      this.canAccess = false;
    }
    this.collectionServ.getUsersCollections(this.currUser)
      .subscribe(result => {
        console.log("currUser: " + this.currUser);
        this.usersColl = result;
        if(JSON.stringify(this.usersColl) == '[{}]') {
          this.none = true;
          console.log("ugghhhhh?");
        }
        else {
          this.readyToDisplay = true;
          console.log("should display now, " + JSON.stringify(this.usersColl));
        }
    })

  }

}
