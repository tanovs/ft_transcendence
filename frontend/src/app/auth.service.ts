import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {waitForAsync} from "@angular/core/testing";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private router: Router) { }
  uri = 'http://localhost:3000/auth'
  login(username: string, password: string) {
    const user = {
      username: username,
      password: password
    }
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    this.http.post(this.uri, JSON.stringify(user), httpOptions)
      .subscribe((resp: any) => {
        console.log(resp.access_token)
        localStorage.setItem('access_token', resp.access_token)
        if (localStorage.getItem('access_token'))
          this.router.navigate(['/users'])
      });


  }

  logout() {
    localStorage.removeItem('access_token');
    this.router.navigate(['/login'])
  }

}
