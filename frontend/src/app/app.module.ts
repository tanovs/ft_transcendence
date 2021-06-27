import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import { UsersComponent } from './users/users.component';
import { ChatComponent } from './chat/chat.component';
import { RegisterComponent } from './register/register.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './login/login.component';


@NgModule({
  declarations: [AppComponent, UsersComponent, ChatComponent, RegisterComponent, LoginComponent],
  imports: [BrowserModule, AppRoutingModule, FormsModule, HttpClientModule, ReactiveFormsModule, NgbModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
