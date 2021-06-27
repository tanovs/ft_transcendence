import { Component, OnInit } from '@angular/core';
import {Observable, throwError} from "rxjs";
import {HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpRequest} from "@angular/common/http";
import {BACKEND_ADDRESS} from "../../environments/environment";
import {catchError, tap} from "rxjs/operators";
import {Router} from "@angular/router";


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
    this.http.get('')
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
