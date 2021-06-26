import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BACKEND_ADDRESS} from "../../environments/environment";
import {catchError} from "rxjs/operators";


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  title = 'Тут работаем с базой данных'

  constructor(private http: HttpClient) {
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

  }
}

interface Person {
  id: number;
  username: number;
  password: string;
}
