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

  getTopTen() {
    return this.http.get('http://localhost:8080/api/collections/ten')
      .map((res:any) => {
        return this.getData(res, "topTen");
      });
  }

  getCertainCollection(cID:String) {
    var url = 'http://localhost:8080/api/collectionInfo/' + cID;
    return this.http.get(url)
      .map((res:any) => {
        return this.getData(res, "specific");
      });
  }

  getUsersCollections(username:String) {
    var url = 'http://localhost:8080/api/collections/' + username;
    return this.http.get(url)
      .map((res:any) => {
        return this.getData(res, "topTen"); //
      })
  }

  setCollectionInfo() {

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

      for(var i = 0; i < allKeys.length; i++) {
        this.id = res[allKeys[i];
        this.id = this.id._id;
        this.name = res[allKeys[i]].name;
        this.rating = res[allKeys[i]].rating;
        this.img = res[allKeys[i]].imgLinks[0];
        this.descr = res[allKeys[i]].description;
        this.vis = res[allKeys[i]].visibility;
        if (t != "specific") {
          this.img = (this.img).substr(1);
          this.img = (this.img).slice(0, -1);
          this.img = (this.img).split(',')[0];
        }
        obj = {name: this.name, rating: this.rating, img: this.img, id: this.id, descr: this.descr, vis: this.vis}; // clear each iteration
        collections.push(obj);
      }

      return collections;
    }

}
