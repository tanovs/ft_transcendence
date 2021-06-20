import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  register() {
    let user: User = { login: 'Qsymond', password: 'newPassword'}
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    this.http.post('http://localhost:3000/users', JSON.stringify(user), httpOptions).subscribe()
    console.log(JSON.stringify(user))
  }

}
interface User {
  login: string,
  password: string
}
