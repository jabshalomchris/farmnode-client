import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {
  constructor(private httpClient: HttpClient) {}

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
