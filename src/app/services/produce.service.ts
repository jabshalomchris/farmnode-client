import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ProduceModel } from '../models/produce-model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProduceService {
  constructor(private httpClient: HttpClient) {}

  getAllProduces(): Observable<Array<ProduceModel>> {
    return this.httpClient.get<Array<ProduceModel>>(
      'http://localhost:8080/api/produce/'
    );
  }

  getProducebyId(produceId: number): Observable<ProduceModel> {
    return this.httpClient
      .get<ProduceModel>(`http://localhost:8080/api/produce/${produceId}`)
      .pipe(map((response) => response));
  }
}
