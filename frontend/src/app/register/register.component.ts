import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {share} from "rxjs/operators";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  user: User = new User(0,'newUser', '', '')

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
  }


}

class User {
  constructor(
    public id: number,
    public login: string,
  public password: string,
  public guild: string) {}
}
