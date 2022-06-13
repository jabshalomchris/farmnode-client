import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { CreatePostPayload } from '../community/create-post/create-post.payload';
import { PostModel } from '../models/post-model';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(private httpClient: HttpClient) {}

  //creating a new post
  createPost(CreatePostPayload, selectedFile): Observable<any> {
    const formdata = new FormData();
    formdata.append('file', selectedFile);
    formdata.append(
      'post',
      new Blob([JSON.stringify(CreatePostPayload)], {
        type: 'application/json',
      })
    );
    return this.httpClient
      .post<any>(`http://localhost:8080/api/posts/`, formdata)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  //getting all posts
  getAllPosts(page: number): Observable<Array<PostModel>> {
    return this.httpClient.get<Array<PostModel>>(
      'http://localhost:8080/api/posts/?pageNo=' + page
    );
  }

  //get posts by ID
  getPostbyId(postId: number): Observable<any> {
    return this.httpClient
      .get<PostModel>(`http://localhost:8080/api/posts/${postId}`)
      .pipe(map((response) => response));
  }
}
