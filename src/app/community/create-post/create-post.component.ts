import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PostService } from 'src/app/services/post.service';
import { CreatePostPayload } from './create-post.payload';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { finalize, throwError } from 'rxjs';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css'],
})
export class CreatePostComponent implements OnInit {
  createPostForm: FormGroup;
  postPayload: CreatePostPayload;
  selectedFile: File;
  isError: boolean;

  constructor(private router: Router, private _postService: PostService) {
    this.postPayload = {
      postName: '',
      file: '',
      description: '',
    };
  }

  ngOnInit(): void {
    this.createPostForm = new FormGroup({
      postName: new FormControl('', Validators.required),
      image: new FormControl(''),
      description: new FormControl('', Validators.required),
    });
  }
  createPost(submitBtn) {
    submitBtn.disabled = true;
    if (this.createPostForm.valid) {
      this.postPayload.postName = this.createPostForm.get('postName')?.value;
      this.postPayload.description =
        this.createPostForm.get('description')?.value;

      this._postService
        .createPost(this.postPayload, this.selectedFile)
        .pipe(
          finalize(() => {
            submitBtn.disabled = false;
          })
        )
        .subscribe(
          (data) => {
            this.isError = false;
            Swal.fire({
              icon: 'success',
              text: 'Post added successfully!',
              showConfirmButton: false,
              // confirmButtonColor: '#8EB540',
              timer: 1300,
            });
            this.router.navigateByUrl('/community');
          },
          (error) => {
            this.isError = true;
            throwError(error);
            Swal.fire({
              icon: 'error',
              text: 'Post add unsuccessful!',
              showConfirmButton: false,
              // confirmButtonColor: '#8EB540',
              timer: 1300,
            });
          }
        );
    }
    submitBtn.disabled = false;
  }
  discardPost() {
    this.router.navigateByUrl('/community');
  }
  upload(event) {
    const file: File = event.target.files[0];
    var pattern = /image-*/;

    if (!file.type.match(pattern)) {
      Swal.fire({
        icon: 'error',
        text: 'Unacceptable File type!',
        confirmButtonColor: '#8EB540',
      });
      this.createPostForm.patchValue({
        image: '',
      });
      return;
    } else {
      this.selectedFile = event.target.files[0];
    }
  }
}
