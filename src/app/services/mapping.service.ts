import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MappingPayload } from '../mapping/mapping.payload';
import { FindProducesPayload } from '../produce/find-produces/find-produces.payload';
import { FindProducesComponent } from '../produce/find-produces/find-produces.component';

@Injectable({
  providedIn: 'root',
})
export class MappingService {
  constructor(private httpClient: HttpClient) {}

  //load map by parameters
  getMap(findProducePayload: FindProducesPayload): Observable<any> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('sw_lat', findProducePayload.sw_lat);
    queryParams = queryParams.append('ne_lat', findProducePayload.ne_lat);
    queryParams = queryParams.append('sw_lng', findProducePayload.sw_lng);
    queryParams = queryParams.append('ne_lng', findProducePayload.ne_lng);
    queryParams = queryParams.append('category', findProducePayload.category);
    queryParams = queryParams.append('status', findProducePayload.status);
    queryParams = queryParams.append('price', findProducePayload.price);
    queryParams = queryParams.append(
      'include_users',
      findProducePayload.includeUsers
    );

    return this.httpClient.get(
      'http://localhost:8080/api/produce/get-geojson',
      {
        params: queryParams,
      }
    );
  }

  //Calling Google GeoCoding API: passing the API Key
  geocode(query): Observable<any> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('address', query);
    queryParams = queryParams.append(
      'key',
      'AIzaSyA62Y9p2gdgelNN7eN7qaIjc1pCVDJYKUo'
    );
    return this.httpClient.get(
      'https://maps.googleapis.com/maps/api/geocode/json',
      {
        params: queryParams,
      }
    );
  }
}
