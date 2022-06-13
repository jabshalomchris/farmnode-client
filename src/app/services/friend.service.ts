import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FriendService {
  constructor(private httpClient: HttpClient) {}

  //adding a new friend - pass the receivers user id
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

  //get list of friends of the current logged user
  getUsersFriends() {
    return this.httpClient
      .get<any>(`http://localhost:8080/api/friends/listFriends`)
      .pipe(map((response) => response));
  }

  //get list of outbound requests of the current logged user
  getoutboundrequests() {
    return this.httpClient
      .get<any>(`http://localhost:8080/api/friends/outbound-requests`)
      .pipe(map((response) => response));
  }

  //get list of inbound requests of the current logged user
  getinboundrequests() {
    return this.httpClient
      .get<any>(`http://localhost:8080/api/friends/inbound-requests`)
      .pipe(map((response) => response));
  }

  //Approve friend request
  approvefriendship(senderId) {
    return this.httpClient.post<any>(
      `http://localhost:8080/api/friends/approve-friend/${senderId}`,
      null
    );
  }

  //Remove a sent request
  cancelRequest(recieverId) {
    return this.httpClient.delete<any>(
      `http://localhost:8080/api/friends/cancel-request/${recieverId}`
    );
  }
}
