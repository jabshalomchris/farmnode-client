import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { CreatePostPayload } from '../community/create-post/create-post.payload';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(private httpClient: HttpClient) {}

  createPost(CreatePostPayload): Observable<any> {
    return this.httpClient
      .post<any>(`http://localhost:8080/api/posts/`, CreatePostPayload)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
}
