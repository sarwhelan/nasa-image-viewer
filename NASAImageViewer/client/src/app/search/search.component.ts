import { Component, OnInit } from '@angular/core';
import { RetrieveImagesService } from '../retrieve-images.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  searchWords;
  serv;
  links; // array holding each link as a string

  constructor(imgServices : RetrieveImagesService) {
    this.serv = imgServices;
  }

  sendSearchWords(words : string) {
    this.searchWords = words;
    this.links = this.serv.getImages(this.searchWords);
  }

  /*displayImg(link : String) {

  }*/

  ngOnInit() { }

}
