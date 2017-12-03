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
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

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
  visChanged = "private";
  cName;
  cDesc;
  currID; // for editing

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

  onSelChange(newVal:String) {
    if(newVal == "privateNow") {
      this.visChanged = "private";
      console.log("private now");
    }
    else {
      this.visChanged = "public";
      console.log("public now");
    }
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

  editColl(addImg:String, removeImg:String) { // id is _id!!
    // get current images in collection
    var imgList = [];
    var origImages = [];
    var toSend;
    addImg = null; removeImg = null;
    var cName = document.getElementById('cName').value;
    var cDesc = document.getElementById('cDesc').value;

    this.collectionServ.getCertainCollection(this.currID)
      .subscribe(result => {
          origImages = result[0].img;
          console.log("orig: " + origImages);

          // alter imgList to ADD this new img
          if (addImg != null) {

          }
          // alter imgList to DELETE the img specified
          else if (removeImg != null) {

          }
          // send origImages because we are editing other things, not the images
          else {
            console.log("got here!");
            console.log("orig again: " + origImages);
            imgList = origImages;
            console.log(imgList);
          }
          // API requires name, desc, imgs, vis
          // therefore collection will send this in JSON >> collectionServ.setCollectionInfo(id, jsonMsg),
          // it'll send to >> PUT /collectionInfo/id
          toSend = {name: cName, desc: cDesc, vis: this.visChanged, imgs: imgList};
          console.log(toSend);
          this.collectionServ.setCollectionInfo(this.currID, toSend).subscribe(result => {
            console.log("cool");
          })
      });

    /*
    // alter imgList to ADD this new img
    if (addImg != null) {

    }
    // alter imgList to DELETE the img specified
    else if (removeImg != null) {

    }
    // send origImages because we are editing other things, not the images
    else {
      console.log("got here!");
      console.log("orig again: " + origImages);
      imgList = origImages;
      console.log(imgList);
    }
    // API requires name, desc, imgs, vis
    // therefore collection will send this in JSON >> collectionServ.setCollectionInfo(id, jsonMsg),
    // it'll send to >> PUT /collectionInfo/id
    console.log(this.visChanged,imgList);
    toSend = {name: cName, desc: cDesc, vis: this.visChanged, imgs: this.imgList};
    /*this.collectionServ.setCollectionInfo(this.currID, toSend).subscribe(result => {
      console.log("cool");
    })*/
  }

  getCollInfo(id:String) {
    this.currID = id;
    this.collectionServ.getCertainCollection(id)
      .subscribe(result => {
        if(result.msg != "unsuccessful") {
          this.collName = result[0].name;
          this.descr = result[0]. descr;
          this.vis = result[0].vis;
        }
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
        if(JSON.stringify(this.usersColl) == '[]') {
          this.none = true;
        }
        else {
          this.readyToDisplay = true;
        }
    })

  }

}
