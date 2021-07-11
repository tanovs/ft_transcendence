import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-login42',
  templateUrl: './login42.component.html',
  styleUrls: ['./login42.component.css']
})
export class Login42Component implements OnInit {
  private routeSubscription: Subscription;
  private querySubscription: Subscription;
  code: any
  cc: any
  UID = 'a584228fa2773785f54399fbeea9ee244b7055e1312a6852895fb194ba13ddde'
  SECRET = 'c57cd236e6453a746f1e4bc1753029f7841fb4290c5c75741697b912f63dd81d'
  constructor(private route: ActivatedRoute,
              private http: HttpClient) {
    this.routeSubscription = route.params.subscribe(params=>this.code=params['code']);
    this.querySubscription = route.queryParams.subscribe(
      (queryParam: any) => {
        this.code = queryParam['code'];
      }
    );
  }

  ngOnInit(): void {
    let params = new URLSearchParams();

    if (this.code)
      this.http.post('http://localhost:3000/auth/42/token', {
      'code':this.code
      }).subscribe(
      data => this.saveToken(data),
      err => alert('Invalid Credentials'))

  }


  saveToken(token: any) {
    localStorage.setItem('access_token', token.access_token)
    this.cc = localStorage.getItem('access_token')
    window.location.href = 'http://localhost:8080/users'
  }
}
