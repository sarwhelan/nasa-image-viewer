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
        return this.getData(res);
      });
  }

  getData(res:any) { // we want the first img, the title, and the rating
    var obj, name, rating, img, id;
    var allKeys = Object.keys(res);
    var collections = [];

    for(var i = 0; i < allKeys.length; i++) {
      this.id = res[allKeys[i];
      this.name = res[allKeys[i]].name;
      this.rating = res[allKeys[i]].rating;
      this.img = res[allKeys[i]].imgLinks[0];
      this.img = (this.img).substr(1);
      this.img = (this.img).slice(0, -1);
      this.img = (this.img).split(',')[0];
      obj = {name: this.name, rating: this.rating, img: this.img}; // clear each iteration
      collections.push(obj);
    }

    return collections;

  }

}
