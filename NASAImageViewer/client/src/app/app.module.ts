import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule }   from '@angular/router';
import { routing } from './app.routes';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { SearchComponent } from './search/search.component';
import { RetrieveImagesService } from './retrieve-images.service';
import { UserService } from './user.service';
import { HomePageComponent } from './home-page/home-page.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DmcaComponent } from './dmca/dmca.component';
import { CollectionsComponent } from './collections/collections.component';
import { CommonModule } from '@angular/common';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { LoadUserCollectionsService } from './load-user-collections.service';
import { EditCollectionsService } from './edit-collections.service'


@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    HomePageComponent,
    LoginComponent,
    RegisterComponent,
    DmcaComponent,
    CollectionsComponent,
    PrivacyPolicyComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpModule,
    routing,
    CommonModule,
    FormsModule
  ],
  providers: [RetrieveImagesService, UserService, LoadUserCollectionsService, EditCollectionsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
