import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule }   from '@angular/router';
import { routing } from './app.routes';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from "@angular/common/http";

import { AppComponent } from './app.component';
import { SearchComponent } from './search/search.component';
import { RetrieveImagesService } from './retrieve-images.service';
import { UserService } from './user.service';
import { HomePageComponent } from './home-page/home-page.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DmcaComponent } from './dmca/dmca.component';
import { CollectionsComponent } from './collections/collections.component';



@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    HomePageComponent,
    LoginComponent,
    RegisterComponent,
    DmcaComponent,
    CollectionsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpModule,
    routing
  ],
  providers: [RetrieveImagesService, UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
