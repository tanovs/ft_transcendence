import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UsersComponent} from "./users/users.component";
import {ChatComponent} from "./chat/chat.component";
import {LoginComponent} from "./login/login.component";
import {AppComponent} from "./app.component";

const routes: Routes = [
  { path: 'users', component: UsersComponent },
  { path: 'chat', component: ChatComponent},
  { path: 'login', component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
