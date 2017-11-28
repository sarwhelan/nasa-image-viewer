import { Injectable } from '@angular/core';

@Injectable()
export class RetrieveImagesService {

  searchString = "https://images-api.nasa.gov/search?";
  individualWords;
  index;
  val = [];
  HttpClient = function() {
    this.get = function(aURL, callback) {
      var httpReq = new XMLHttpRequest();
      httpReq.onreadystatechange = function() {
        if (httpReq.readyState == 4 && httpReq.status == 200)
          callback(httpReq.responseText);
      }
      httpReq.open("GET", aURL, true);
      httpReq.send(null);
    }
  }

  constructor() { }

  getImages(searchWords : string) : string[] {
    this.searchString += "q=";

    if (searchWords.indexOf(' ') >= 0) { // if there are spaces, i.e. multiple search words
      this.individualWords = searchWords.split(/[ ,]+/);
      for (this.index = 0; this.index < this.individualWords.length; this.index++) {
        this.searchString += this.individualWords[this.index];
        if (this.index < this.individualWords.length - 1) {
          this.searchString += "%20";
        }
      }
    }
    else
      this.searchString += searchWords;

    this.searchString += "&media_type=image";
    console.log("search string: " + this.searchString);
    var cli = new this.HttpClient();
    var imgLinks = [];


    cli.get(this.searchString, function(response) {
      var obj = JSON.parse(response);
      var numLinks = obj.collection.items.length;
      var linkNum;
      //var imgLinks = [];
      for (linkNum = 0; linkNum < numLinks; linkNum++) {
        imgLinks.push(obj.collection.items[linkNum].links[0].href);
        console.log(imgLinks[linkNum]);
      }
    })

    this.individualWords = "";
    this.searchString = "https://images-api.nasa.gov/search?";
    return imgLinks;
  }

}
