import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {
  constructor(private httpClient: HttpClient) {}

  addSubscription(produceId: number): Observable<any> {
    return this.httpClient
      .post<any>(`http://localhost:8080/api/subscription/${produceId}`, null)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  unsubscribe(produceId: number): Observable<any> {
    return this.httpClient
      .post<any>(
        `http://localhost:8080/api/subscription/unsubscribe/${produceId}`,
        null
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  getMySubscriptions(): Observable<any> {
    return this.httpClient
      .get<any>('http://localhost:8080/api/subscription/by-user-detailed')
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  // getAllSubscribes(): Observable<Array<ProduceModel>> {
  //   return this.httpClient.get<Array<ProduceModel>>(
  //     'http://localhost:8080/api/produce/'
  //   );
  // }

  // getProducebyId(produceId: number): Observable<ProduceModel> {
  //   return this.httpClient
  //     .get<ProduceModel>(`http://localhost:8080/api/produce/${produceId}`)
  //     .pipe(map((response) => response));
  // }
}
