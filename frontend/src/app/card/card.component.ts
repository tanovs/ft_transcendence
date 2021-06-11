import {Component, OnInit} from "@angular/core";
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { share } from 'rxjs/operators';

@Component({
  selector: 'app-card',
  styleUrls: ['./card.component.css'],
  templateUrl: './card.component.html',
})
export class CardComponent implements OnInit {
  users$: Observable<Person[]> = this.getUsers();
  constructor(private http: HttpClient) {
  }

  getUsers(): Observable<Person[]> {
    return this.http.get<Person[]>('http://localhost:3000/users').pipe(share());
  }

  ngOnInit(): void {
  }

}

interface Person {
  id: number;
  login: number;
  password: string;
  guild: string;
}
