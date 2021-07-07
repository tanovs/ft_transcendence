import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-login42',
  templateUrl: './login42.component.html',
  styleUrls: ['./login42.component.css']
})
export class Login42Component implements OnInit {

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  getCode() {
    return this.http.get('http://localhost:3000/users')
  }
}
