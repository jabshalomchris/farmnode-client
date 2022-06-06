import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ProduceModel } from '../models/produce-model';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { AddProducePayload } from '../produce/add-produce/add-produce.payload';
import { MappingPayload } from '../mapping/mapping.payload';
import { FindProducesPayload } from '../produce/find-produces/find-produces.payload';

@Injectable({
  providedIn: 'root',
})
export class ProduceService {
  constructor(private httpClient: HttpClient) {}

  getAllProduces(): Observable<Array<ProduceModel>> {
    return this.httpClient.get<Array<ProduceModel>>(
      'http://localhost:8080/api/produce'
    );
  }

  getProducesbyFilter(
    findProducePayload: FindProducesPayload
  ): Observable<any> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('sw_lat', findProducePayload.sw_lat);
    queryParams = queryParams.append('ne_lat', findProducePayload.ne_lat);
    queryParams = queryParams.append('sw_lng', findProducePayload.sw_lng);
    queryParams = queryParams.append('ne_lng', findProducePayload.ne_lng);
    queryParams = queryParams.append(
      'include_users',
      findProducePayload.includeUsers
    );
    queryParams = queryParams.append('category', findProducePayload.category);
    queryParams = queryParams.append('status', findProducePayload.status);

    return this.httpClient.get<Array<ProduceModel>>(
      'http://localhost:8080/api/produce/by-filters',
      {
        params: queryParams,
      }
    );
  }

  getProducebyId(produceId: number): Observable<any> {
    return this.httpClient
      .get<Array<ProduceModel>>(
        `http://localhost:8080/api/produce/detailed/${produceId}`
      )
      .pipe(map((response) => response));
  }

  getProducesbyUserId(userId: number): Observable<Array<ProduceModel>> {
    return this.httpClient
      .get<Array<ProduceModel>>(
        `http://localhost:8080/api/produce/by-user/${userId}`
      )
      .pipe(map((response) => response));
  }

  getProducesbyUserIdForRequest(
    userId: number
  ): Observable<Array<ProduceModel>> {
    return this.httpClient
      .get<Array<ProduceModel>>(
        `http://localhost:8080/api/produce/by-user/request/${userId}`
      )
      .pipe(map((response) => response));
  }

  updateProduce(updateProducePayload): Observable<any> {
    return this.httpClient
      .put<any>(
        `http://localhost:8080/api/produce/update/`,
        updateProducePayload
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  editStatus(produceId: number, status: string): Observable<any> {
    return this.httpClient
      .post<any>(
        `http://localhost:8080/api/produce/update-status/${status}/${produceId}`,
        null
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  editPublishStatus(produceId: number, status: string): Observable<any> {
    return this.httpClient
      .post<any>(
        `http://localhost:8080/api/produce/update-publish/${status}/${produceId}`,
        null
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  getProducebyUser(): Observable<Array<ProduceModel>> {
    return this.httpClient.get<Array<ProduceModel>>(
      'http://localhost:8080/api/produce/by-user'
    );
  }

  addProduce(
    addProducePayload: AddProducePayload,
    selectedFile
  ): Observable<boolean> {
    const formdata = new FormData();
    formdata.append('file', selectedFile);
    formdata.append('produceName', addProducePayload.produceName);
    formdata.append('category', addProducePayload.category);
    formdata.append('description', addProducePayload.description);
    formdata.append('price', addProducePayload.price);
    formdata.append('latitude', addProducePayload.latitude);
    formdata.append('longitude', addProducePayload.longitude);
    formdata.append('produceStatus', addProducePayload.produceStatus);
    formdata.append('measureType', addProducePayload.measureType);
    formdata.append('publishStatus', addProducePayload.publishStatus);

    return this.httpClient
      .post<any>('http://localhost:8080/api/produce', formdata)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
}
