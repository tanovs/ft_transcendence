import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UsersComponent} from "./users/users.component";

import {Login42Component} from "./login42/login42.component";


const routes: Routes = [
  { path: 'users', component: UsersComponent },
  { path: 'login', component: Login42Component},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
