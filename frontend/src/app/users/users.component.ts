import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BACKEND_ADDRESS} from "../../environments/environment";
import {Router} from "@angular/router";
import {AuthInterceptor} from "../auth.interceptor";



@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  title = 'Тут работаем с базой данных'

  constructor(private http: HttpClient,
              private router: Router) {
  }

  users$: Observable<Person[]> = this.getUsers();

  getUsers(): Observable<Person[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization':  'Bearer ' + localStorage.getItem('access_token')
      })
    };
    return this.http.get<Person[]>(BACKEND_ADDRESS + '/users', httpOptions).pipe();
  }

  ngOnInit(): void {
    if (!localStorage.getItem('access_token'))
    {
      this.router.navigate(['/login'])
    }
  }
}

interface Person {
  id: number;
  username: number;
  password: string;
}
