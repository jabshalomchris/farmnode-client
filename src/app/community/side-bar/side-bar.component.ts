import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css'],
})
export class SideBarComponent implements OnInit {
  constructor(private router: Router, private modalService: NgbModal) {}

  ngOnInit(): void {}

  goToCreatePost() {
    this.router.navigateByUrl('/create-post');
  }

  goToCreateSubreddit() {
    this.router.navigateByUrl('/create-subreddit');
  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }
}
