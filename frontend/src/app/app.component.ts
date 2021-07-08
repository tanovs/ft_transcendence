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

  logout() {
    this.authService.logout();
  }

  isAuthorised() : boolean {
    if (localStorage.getItem('access_token'))
      return true;
    return false;
  }
}


