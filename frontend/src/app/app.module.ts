import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import { UsersComponent } from './users/users.component';
import { FirstComponent } from './first/first.component';
import { SecondComponent } from './second/second.component';
import { RegisterComponent } from './register/register.component';

@NgModule({
  declarations: [AppComponent, UsersComponent, FirstComponent, SecondComponent, RegisterComponent],
  imports: [BrowserModule, AppRoutingModule, FormsModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
