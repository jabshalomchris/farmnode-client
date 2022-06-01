import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  private header = new HttpHeaders({ 'content-type': 'application/json' });
  constructor(private httpClient: HttpClient) {}

  addRequest(request): Observable<any> {
    return this.httpClient
      .post<any>('http://localhost:8080/api/request', request, {
        headers: this.header,
      })
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
}
