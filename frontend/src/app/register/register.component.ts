import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BACKEND_ADDRESS} from "../../environments/environment";
import {FormBuilder} from "@angular/forms";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  title = 'Форма регистрации'
  registerForm = this.formBuilder.group({
    username: '',
    password: ''
  });

  constructor(private formBuilder: FormBuilder, private http: HttpClient) { }

  ngOnInit(): void {
  }

  register() {
    const user = {
      username: this.registerForm.value.username,
      password: this.registerForm.value.password
    }
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    console.log(this.registerForm)
    this.http.post(BACKEND_ADDRESS + '/users', JSON.stringify(user), httpOptions).subscribe()
  }

}
