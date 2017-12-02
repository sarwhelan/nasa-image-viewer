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

  // set up stuff, used in constructor
  router;
  userServ;
  collectionServ;
  searchServ;
  currUser;

  // stuff we display in HTML
  usersColl = [];
  imgs = [];
  collName;

  // vars used in editing form, to display initial values
  descr;
  vis;

  // variables for tracking stuff
  canAccess = true; // checking if user is authenticated
  readyToDisplay = false; // used for showing collections made by the user
  none = false; // use if no collections made yet by user


  constructor(rt: Router, userService: UserService, cm: CommonModule, collServ: LoadUserCollectionsService, searchS: RetrieveImagesService) {
    this.collectionServ = collServ;
    this.router = rt;
    this.userServ = userService;
    this.searchServ = searchS;
  }

  getImagesInCollection(id:String) { // called when View Full Collection button is clicked
    var x;
    // sending the _id value of a collection to load-user-collection service
    this.collectionServ.getCertainCollection(id)
      .subscribe(result => {
        console.log(result);
        this.collName = result[0].name;
        x = (result[0].img).substr(1);
        x = x.slice(0, -1);
        this.imgs = (x).split(",");
      })
  }

  editColl(id:String) { // id is _id!!
    this.collectionServ.getCertainCollection(id)
      .subscribe(result => {

      })
  }

  getCollInfo(id:String) {
    this.collectionServ.getCertainCollection(id)
      .subscribe(result => {
        this.collName = result[0].name;
        this.descr = result[0]. descr;
        this.vis = result[0].vis;
      })
  }

  deleteCollection(id:String) {
    this.collectionServ.deleteColl(id)
      .subscribe(result => {
        if(result.msg == "unsuccessful")
          console.log("error");
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
        }
        else {
          this.readyToDisplay = true;
        }
    })

  }

}
