import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UsersComponent} from "./users/users.component";
import {ChatComponent} from "./chat/chat.component";
import {LoginComponent} from "./login/login.component";
import {Login42Component} from "./login42/login42.component";


const routes: Routes = [
  { path: 'users', component: UsersComponent },
  { path: 'chat', component: ChatComponent},
  { path: 'login', component: LoginComponent},
  { path: 'login42', component: Login42Component}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
