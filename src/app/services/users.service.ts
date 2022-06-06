import { HttpClient, HttpParams } from '@angular/common/http';
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

  getGrowerdetails(username: string): Observable<any> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('username', username);

    return this.httpClient
      .get<any>(`http://localhost:8080/api/friends/fellow-user`, {
        params: queryParams,
      })
      .pipe(map((response) => response));
  }

  getGrowerdetailsById(userId: number): Observable<any> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('userId', userId);

    return this.httpClient
      .get<any>(`http://localhost:8080/api/friends/fellow-user-by-id`, {
        params: queryParams,
      })
      .pipe(map((response) => response));
  }

  getUsersDetail(): Observable<any> {
    return this.httpClient
      .get<any>(`http://localhost:8080/api/get-user-details`)
      .pipe(map((response) => response));
  }
}
