import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MappingPayload } from '../mapping/mapping.payload';

@Injectable({
  providedIn: 'root'
})
export class MappingService {

  constructor(private httpClient: HttpClient) { }

  getMap(mappingPayload: MappingPayload): Observable<any> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("sw_lat",mappingPayload.sw_lat);
    queryParams = queryParams.append("ne_lat",mappingPayload.ne_lat);
    queryParams = queryParams.append("sw_lng",mappingPayload.sw_lng);
    queryParams = queryParams.append("ne_lng",mappingPayload.ne_lng);

    return this.httpClient.get('http://localhost:8080/api/produce/geoJsonNew', {params:queryParams});
  }
}
