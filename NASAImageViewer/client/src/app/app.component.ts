import { Component } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { DmcaComponent } from './dmca/dmca.component';
import { Injector } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'NASA Image Viewer';
}
