import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.css'],
})
export class ViewUserComponent implements OnInit {
  constructor(
    private _userservice: UsersService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const isIdPresent = this._activatedRoute.snapshot.paramMap.has('userId');
    // if (isIdPresent) {
    //   const userId = Number(
    //     this._activatedRoute.snapshot.paramMap.get('produceId')
    //   );
    //   this._userservice
    //     .checkFriendship(userId)
    //     .subscribe((data) => (this.produce = data));
    // }
  }
}
