import {Component, OnInit} from '@angular/core';
import {io, Socket} from "socket.io-client";
import {AuthService} from "./auth.service";
import {FormBuilder} from "@angular/forms";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  registerForm = this.formBuilder.group({
    username: '',
    password: ''
  });

  constructor(private formBuilder: FormBuilder, private http: HttpClient, private authService: AuthService) {
  }

  login() {
    this.authService.login(this.registerForm.value.username, this.registerForm.value.password)
  }

  logout() {
    this.authService.logout()
  }


}


