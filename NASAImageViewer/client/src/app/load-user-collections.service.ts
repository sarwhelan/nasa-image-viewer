import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpModule } from '@angular/http';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/from';

@Injectable()
export class LoadUserCollectionsService {

  collections = [];

  constructor(private http: HttpClient) { }

  // for getting COLLECTIONS with one img to display
  getTopTen() {
    return this.http.get('http://localhost:8080/api/collections/ten')
      .map((res:any) => {
        return this.getData(res, "one");
      });
  }

  getUsersCollections(username:String) {
    var url = 'http://localhost:8080/api/collections/' + username;
    return this.http.get(url)
      .map((res:any) => {
        return this.getData(res, "one"); //
      })
  }
  // -------------------------------------------------

  // get ALL things to do with a collection that we care about, including ALL of the string containing the img links
  getCertainCollection(cID:String) {
  console.log("get coll info" + cID);
    var url = 'http://localhost:8080/api/collectionInfo/' + cID;
    return this.http.get(url)
      .map((res:any) => {
          console.log("here" + JSON.stringify(this.getData(res, "many")));
          return this.getData(res, "many");
      });
  }
  // -------------------------------------------------

  setCollectionInfo(id:String, jsonMsg:JSON) {
    console.log("set coll info");
    var url = 'http://localhost:8080/api/collectionInfo/' + id;
    return this.http.post(url, jsonMsg)
      .map((res:any) => {
        return res;
      })
  }

  deleteColl(id:String) {
    var url = 'http://localhost:8080/api/collections/' + id;
    return this.http.delete(url)
      .map((res:any) => {
        return res;
      })
  }

  getData(res:any, t:String) {

      var obj, name, rating, img, id, descr, vis;
      var allKeys = Object.keys(res);
      var collections = [];
      console.log("merp: " + JSON.stringify(res));

      for(var i = 0; i < allKeys.length; i++) {
        this.id = res[allKeys[i];
        this.id = this.id._id;
        this.name = res[allKeys[i]].name;
        this.rating = res[allKeys[i]].rating;
        console.log("HIII: " + res[allKeys[i]].imgLinks);
        if (res[allKeys[i]].imgLinks == "") {
          console.log("yep");
        }
        else {
          this.img = res[allKeys[i]].imgLinks[0];
          this.descr = res[allKeys[i]].description;
          this.vis = res[allKeys[i]].visibility;
          if (t == "one") { // limit to one img to be used as cover photo
            this.img = (this.img).substr(1);
            this.img = (this.img).slice(0, -1);
            this.img = (this.img).split(',')[0];
          }
        }
        obj = {name: this.name, rating: this.rating, img: this.img, id: this.id, descr: this.descr, vis: this.vis};
        collections.push(obj);
      }

      return collections;
    }

}
