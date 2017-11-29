import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component'; // all users see this, default
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { SearchComponent } from './search/search.component'; // for authenticated users
import { DmcaComponent } from './dmca/dmca.component';
import { CollectionsComponent } from './collections/collections.component';

export const routes: Routes = [
  { path: 'home', component: HomePageComponent},
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'search', component: SearchComponent },
  { path: 'dmca', component: DmcaComponent},
  { path: 'collections', component: CollectionsComponent},
  { path: '', redirectTo: 'home', pathMatch: 'full'}
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
