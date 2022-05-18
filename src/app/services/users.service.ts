import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private httpClient: HttpClient) {}

  checkFriendship(userId: number): Observable<any> {
    return this.httpClient
      .get<any>(`http://localhost:8080/api/produce/${userId}`)
      .pipe(map((response) => response));
  }
}
