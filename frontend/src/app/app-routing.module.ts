import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UsersComponent} from "./users/users.component";

import {Login42Component} from "./login42/login42.component";
import {ChatComponent} from "./chat/chat.component";


const routes: Routes = [
  { path: 'users', component: UsersComponent },
  { path: 'login', component: Login42Component},
  { path: 'chat', component: ChatComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
