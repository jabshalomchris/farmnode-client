import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faComments, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { PostModel } from '../../models/post-model';
import { PostService } from '../../services/post.service';
import { PostCommentModel } from '../../models/comment/post-comment-model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PostCommentPayload } from './post-comment.payload';
import { CommentService } from 'src/app/services/comment.service';
import { ToastrService } from 'ngx-toastr';
import { finalize, throwError } from 'rxjs';

@Component({
  selector: 'app-view-posts',
  templateUrl: './view-posts.component.html',
  styleUrls: ['./view-posts.component.css'],
})
export class ViewPostsComponent implements OnInit {
  postId;
  faComments = faComments;
  faArrowLeft = faArrowLeft;
  post: PostModel = new PostModel();
  commentForm: FormGroup;
  commentPayload: PostCommentPayload;
  comments$: Array<PostCommentModel>;
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _postService: PostService,
    private _commentService: CommentService,
    private toastr: ToastrService
  ) {
    this.commentPayload = {
      commentText: '',
      postId: 0,
    };
  }

  ngOnInit(): void {
    const isIdPresent = this._activatedRoute.snapshot.paramMap.has('postId');
    if (isIdPresent) {
      this.postId = Number(
        this._activatedRoute.snapshot.paramMap.get('postId')
      );
      this._postService.getPostbyId(this.postId).subscribe((data) => {
        console.log(data);
        this.post = data;
      });
      this.getCommentsForPost(this.postId);
    }
    this.commentForm = new FormGroup({
      text: new FormControl('', Validators.required),
    });
  }

  postComment(submitBtn) {
    submitBtn.disabled = true;
    this.commentPayload.commentText = this.commentForm.get('text')?.value;
    this.commentPayload.postId = this.post.postId;

    this._commentService
      .addPostComment(this.commentPayload)
      .pipe(
        finalize(() => {
          submitBtn.disabled = false;
        })
      )
      .subscribe(
        (data) => {
          this.commentForm.reset();
          this.toastr.success('Comment added successfully');
          this.getCommentsForPost(this.postId);
        },
        (error) => {
          throwError(error);
          this.toastr.error('Commenting failed');
        }
      );
    submitBtn.disabled = false;
  }

  getCommentsForPost(postId) {
    this._commentService.getCommentsByPost(postId).subscribe((data) => {
      console.log(data);
      this.comments$ = data;
    });
  }
}
