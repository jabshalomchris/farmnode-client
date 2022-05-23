import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ProduceModel } from '../models/produce-model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AddProducePayload } from '../produce/add-produce/add-produce.payload';

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

  addProduce(addProducePayload: AddProducePayload): Observable<boolean> {
    return this.httpClient
      .post<any>('http://localhost:8080/api/produce', addProducePayload)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
}
