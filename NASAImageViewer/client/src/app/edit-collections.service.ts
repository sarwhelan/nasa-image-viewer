import { Injectable } from '@angular/core';
import { Injector } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from "@angular/common/http";
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LoadUserCollectionsService } from './load-user-collections.service';
import { RetrieveImagesService} from './retrieve-images.service';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Injectable()
export class EditCollectionsService {

  router;
  userServ;
  collectionServ;
  searchServ;
  currUser;

  constructor(userService: UserService, cm: CommonModule, collServ: LoadUserCollectionsService, searchS: RetrieveImagesService) {
    this.collectionServ = collServ;
    this.userServ = userService;
    this.searchServ = searchS;
  }

  editCollection(id:String, cName:String, cDesc:String, vis:String, addImg:String, removeImg:String) {
    var imgList = [];
    var origImages = [];
    var toSend = {};

    this.collectionServ.getCertainCollection(id)
      .subscribe(result => {
          origImages = result[0].img;
          var x;

          // alter imgList to ADD this new img
          if (addImg != null) {
            var imgString = origImages.toString();
            imgString = (imgString).slice(0, -1);
            imgString = imgString + ',' + addImg + ']';
            x = '[' + imgString + ']';
            console.log("when adding img new list is: " + x);
            imgList = [imgString];
          }
          // alter imgList to DELETE the img specified
          else if (removeImg != null) {
            var imgString = origImages.toString();
            imgString = imgString.substr(1);
            imgString = imgString.slice(0, -1);
            if (imgString.indexOf(',') == -1) { // if we're removing the only image
              imgList = ['[]']; // make it empty
            }
            else { // else take out that certain img and send back array
              imgString = imgString.split(',');// array now
              var index = imgString.indexOf(removeImg);
              imgString = imgString.splice(index, 1);
              imgString = imgString.toString();
              imgString = '[' + imgString + ']';
              imgList = [imgString];
            }
          }
          // send origImages because we are editing other things, not the images
          else {
            imgList = origImages;
          }
          // API requires name, desc, imgs, vis
          // therefore collection will send this in JSON >> collectionServ.setCollectionInfo(id, jsonMsg),
          // it'll send to >> PUT /collectionInfo/id
          toSend = {'name': cName, 'desc': cDesc, 'vis': vis, 'imgs': imgList};
          console.log("changing to: " + JSON.stringify(toSend));
          this.collectionServ.setCollectionInfo(id, toSend)
            .subscribe(result => {
              console.log("editing info worked" + result);
            });
      });
  }

}
