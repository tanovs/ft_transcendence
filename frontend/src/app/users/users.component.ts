import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BACKEND_ADDRESS} from "../../environments/environment";
import {Router} from "@angular/router";
import {AuthInterceptor} from "../auth.interceptor";
import {AuthService} from "../auth.service";
import {share} from "rxjs/operators";



@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {
  title = 'Тут работаем с базой данных'
  users$: Observable<Person[]> = this.getUsers();
  constructor(private http: HttpClient) {
  }

  getUsers(): Observable<Person[]> {

   return this.http.get<Person[]>('http://localhost:3000/users', {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
      }
    }).pipe(share())
  }
}

interface Person {
  id: number;
  email: number;
  login: string;
  displayname: string
}
