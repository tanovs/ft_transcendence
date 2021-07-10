import {Component, OnInit} from '@angular/core';
import {AuthService} from "./auth.service";
import {Subscription} from "rxjs";
import {ActivatedRoute} from "@angular/router";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit{

  constructor(private authService: AuthService) {
  }


  ngOnInit(): void {
  }

  login() {
    window.location.href = 'https://api.intra.42.fr/oauth/authorize?client_id=a584228fa2773785f54399fbeea9ee244b7055e1312a6852895fb194ba13ddde&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2F42&response_type=code'
  }

  logout() {
    localStorage.removeItem('access_token')
    window.location.reload()
  }

  isAuthorised() : boolean {
    if (localStorage.getItem('access_token'))
      return true;
    return false;
  }
}


