import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MappingPayload } from '../mapping/mapping.payload';

@Injectable({
  providedIn: 'root',
})
export class MappingService {
  constructor(private httpClient: HttpClient) {}

  getMap(
    mappingPayload: MappingPayload,
    included: boolean,
    category,
    status
  ): Observable<any> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('sw_lat', mappingPayload.sw_lat);
    queryParams = queryParams.append('ne_lat', mappingPayload.ne_lat);
    queryParams = queryParams.append('sw_lng', mappingPayload.sw_lng);
    queryParams = queryParams.append('ne_lng', mappingPayload.ne_lng);
    queryParams = queryParams.append('category', category);
    queryParams = queryParams.append('status', status);
    queryParams = queryParams.append('include_users', included);

    return this.httpClient.get('http://localhost:8080/api/produce/geoJsonNew', {
      params: queryParams,
    });
  }

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
