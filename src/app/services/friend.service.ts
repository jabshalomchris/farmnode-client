import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FriendService {
  constructor(private httpClient: HttpClient) {}

  addFriend(recieverId: number): Observable<boolean> {
    return this.httpClient
      .post<any>(
        `http://localhost:8080/api/friends/addFriend/${recieverId}`,
        null
      )
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  getUsersFriends() {
    return this.httpClient
      .get<any>(`http://localhost:8080/api/friends/listFriends`)
      .pipe(map((response) => response));
  }

  getoutboundrequests() {
    return this.httpClient
      .get<any>(`http://localhost:8080/api/friends/outbound-requests`)
      .pipe(map((response) => response));
  }

  getinboundrequests() {
    return this.httpClient
      .get<any>(`http://localhost:8080/api/friends/inbound-requests`)
      .pipe(map((response) => response));
  }

  approvefriendship(senderId) {
    return this.httpClient.post<any>(
      `http://localhost:8080/api/friends/approve-friend/${senderId}`,
      null
    );
  }

  cancelRequest(recieverId) {
    return this.httpClient.delete<any>(
      `http://localhost:8080/api/friends/cancel-request/${recieverId}`
    );
  }
}
