import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private http: HttpClient) { }
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
      });
  }

  logout() {
    localStorage.removeItem('access_token');
  }

}
