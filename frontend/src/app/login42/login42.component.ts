import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-login42',
  templateUrl: './login42.component.html',
  styleUrls: ['./login42.component.css']
})
export class Login42Component implements OnInit {
  private routeSubscription: Subscription;
  private querySubscription: Subscription;
  code: any

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
    // if (this.code)
    //   console.log(this.http.post('http://localhost:3000/auth/42/token', {
    //     code: this.code
    //   }).subscribe())
  }

}
