import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommentPayload } from '../produce/other-produce/comment.payload';
import { map, Observable } from 'rxjs';
import { ProduceCommentModel } from '../models/comment/produce-comment-model';
import { PostCommentPayload } from '../community/view-posts/post-comment.payload';
import { PostCommentModel } from '../models/comment/post-comment-model';

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

  addPostComment(commentPayload: PostCommentPayload): Observable<boolean> {
    return this.httpClient
      .post<any>('http://localhost:8080/api/comments', commentPayload)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  getCommentsByPost(postId): Observable<Array<PostCommentModel>> {
    return this.httpClient.get<Array<PostCommentModel>>(
      `http://localhost:8080/api/comments/by-post/${postId}`
    );
  }
}
