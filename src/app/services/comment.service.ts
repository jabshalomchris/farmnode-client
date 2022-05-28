import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommentPayload } from '../produce/other-produce/comment.payload';
import { map, Observable } from 'rxjs';
import { ProduceCommentModel } from '../models/comment/produce-comment-model';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  constructor(private httpClient: HttpClient) {}

  addProduceComment(commentPayload: CommentPayload): Observable<boolean> {
    return this.httpClient
      .post<any>('http://localhost:8080/api/produce/comments', commentPayload)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  getCommentsByProduce(produceId): Observable<Array<ProduceCommentModel>> {
    return this.httpClient.get<Array<ProduceCommentModel>>(
      `http://localhost:8080/api/produce/comments/by-produce/${produceId}`
    );
  }
}
