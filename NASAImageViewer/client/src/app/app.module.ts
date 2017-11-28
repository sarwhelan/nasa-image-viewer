import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule }   from '@angular/router';
import { routing } from './app.routes';

import { AppComponent } from './app.component';
import { SearchComponent } from './search/search.component';
import { RetrieveImagesService } from './retrieve-images.service';
import { HomePageComponent } from './home-page/home-page.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';



@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    HomePageComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    routing
  ],
  providers: [RetrieveImagesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
