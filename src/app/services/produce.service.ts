import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ProduceModel } from '../models/produce-model';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { AddProducePayload } from '../produce/add-produce/add-produce.payload';
import { MappingPayload } from '../mapping/mapping.payload';

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
    mappingPayload: MappingPayload,
    include,
    category,
    status
  ): Observable<any> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('sw_lat', mappingPayload.sw_lat);
    queryParams = queryParams.append('ne_lat', mappingPayload.ne_lat);
    queryParams = queryParams.append('sw_lng', mappingPayload.sw_lng);
    queryParams = queryParams.append('ne_lng', mappingPayload.ne_lng);
    queryParams = queryParams.append('include_users', include);
    queryParams = queryParams.append('category', category);
    queryParams = queryParams.append('status', status);

    return this.httpClient.get<Array<ProduceModel>>(
      'http://localhost:8080/api/produce/produceFiltersNew',
      {
        params: queryParams,
      }
    );
  }

  getProducebyId(produceId: number): Observable<ProduceModel> {
    return this.httpClient
      .get<ProduceModel>(
        `http://localhost:8080/api/produce/detailed/${produceId}`
      )
      .pipe(map((response) => response));
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
