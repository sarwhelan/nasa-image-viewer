import { Component, OnInit } from '@angular/core';
import { RetrieveImagesService } from '../retrieve-images.service';
import { LoadUserCollectionsService } from '../load-user-collections.service';
import { UserService } from '../user.service'
import { EditCollectionsService } from '../edit-collections.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  searchWords;
  serv;
  links; // array holding each link as a string
  currLink;
  userCollServ;
  userServ;
  collNames = [];
  ids = [];

  ngOnInit() { }

  constructor(edit: EditCollectionsService, imgServices: RetrieveImagesService, userCollS: LoadUserCollectionsService, us: UserService) {
    this.serv = imgServices;
    this.userCollServ = userCollS;
    this.userServ = us;
    this.editColl = edit;
  }

  sendSearchWords(words : string) {
    this.searchWords = words;
    this.links = this.serv.getImages(this.searchWords);
  }

  displayImg(link : String) {
    this.currLink = link;
  }

  pickedColl(collPicked:String) {
    //add this img to the collection chosen
    // id:String, cName:String, cDesc:String, vis:String, addImg:String, removeImg:String
    //add this.currLink to current list of imgs

    // get info about collection we're adding to...
    var index = this.collNames.indexOf(collPicked);
    var id = this.ids[index];
    console.log("id lol" + id);
    this.userCollServ.getCertainCollection(id)
      .subscribe(result => {
        var name = result[0].name;
        var desc = result[0].descr;
        var vis = result[0].vis;
        var imgs = result[0].img;
        this.editColl.editCollection(id, name, desc, vis, this.currLink, null)
          .subscribe(result => {
            console.log("made it back");
          })

      })

  }

  getCollections() {
    var user = this.userServ.getCurrentUser();
    this.userCollServ.getUsersCollections(user)
      .subscribe(result => {
        console.log(result.length);
        for(var i = 0; i < result.length; i++) {
          this.collNames.push(result[i].name);
          this.ids.push(result[i].id);
        }
      })
  }

}
