import { Component, OnInit } from '@angular/core';
import { faComments } from '@fortawesome/free-solid-svg-icons';
import { PostModel } from 'src/app/models/post-model';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-post-tile',
  templateUrl: './post-tile.component.html',
  styleUrls: ['./post-tile.component.css'],
})
export class PostTileComponent implements OnInit {
  posts: PostModel[] = [];
  // posts$: Array<PostModel>;
  faComments = faComments;
  page: number = 0;

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.getPosts();
  }

  //function to get all posts
  getPosts() {
    this.postService.getAllPosts(this.page).subscribe((post) => {
      console.log(post);
      if (post != undefined) {
        post.forEach((item) => {
          this.posts.push(item);
        });
      }
    });
  }

  onScroll() {
    console.log('Scrolled');
    this.page = this.page + 1;
    this.getPosts();
  }
}
