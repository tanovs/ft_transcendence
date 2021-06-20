import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {share} from "rxjs/operators";
import {BACKEND_ADDRESS} from "../../environments/environment";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  title = 'Тут работаем с базой данных'
  users$: Observable<Person[]> = this.getUsers();
  constructor(private http: HttpClient) {
  }

  getUsers(): Observable<Person[]> {
    return this.http.get<Person[]>(BACKEND_ADDRESS + '/users').pipe(share());
  }

  ngOnInit(): void {

  }
}

interface Person {
  id: number;
  login: number;
  password: string;
  guild: string;
}
