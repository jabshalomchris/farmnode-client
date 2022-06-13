import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faComments } from '@fortawesome/free-solid-svg-icons';
import { PostService } from '../services/post.service';
import { PostModel } from '../models/post-model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.css'],
})
export class CommunityComponent implements OnInit {
  constructor(private router: Router, private modalService: NgbModal) {}

  ngOnInit(): void {}

  goToCreatePost() {
    this.router.navigateByUrl('/create-post');
  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }
}
