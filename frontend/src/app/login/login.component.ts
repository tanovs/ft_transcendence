import { Component, OnInit } from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {AuthService} from "../auth.service";
import {Router} from "@angular/router";
import {HttpHandler} from "@angular/common/http";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  registerForm = this.formBuilder.group({
    username: '',
    password: ''
  });

  constructor(private formBuilder: FormBuilder, private authService: AuthService,
              private router: Router) { }

  ngOnInit(): void {
    if (!localStorage.getItem('access_token'))
    {
      this.router.navigate(['/login'])
    } else
    {
      this.router.navigate(['/users'])
    }
  }


  login() {
    this.authService.login(this.registerForm.value.username, this.registerForm.value.password)
  }

  logout() {
    this.authService.logout()
  }
}
