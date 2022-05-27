import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FriendService } from '../../services/friend.service';

@Component({
  selector: 'app-view-friends',
  templateUrl: './view-friends.component.html',
  styleUrls: ['./view-friends.component.css'],
})
export class ViewFriendsComponent implements AfterViewInit {
  outboundRequests;
  inboundRequests;
  active = 0;

  constructor(
    private _friendservice: FriendService,
    private toastr: ToastrService
  ) {}

  ngAfterViewInit(): void {
    this.getalloutboundrequests();
    this.getallinboundrequests();
  }

  getalloutboundrequests() {
    this._friendservice.getoutboundrequests().subscribe((data) => {
      this.outboundRequests = data;
    });
  }

  getallinboundrequests() {
    this._friendservice.getinboundrequests().subscribe((data) => {
      console.log(data);
      this.inboundRequests = data;
    });
  }

  approvefriend(senderId, event) {
    event.preventDefault();
    this._friendservice.approvefriendship(senderId).subscribe((data) => {
      this.getallinboundrequests();
      this.toastr.success('Connection request approved');
    });
  }

  cancelRequest(recieverId, event) {
    event.preventDefault();
    this._friendservice.cancelRequest(recieverId).subscribe((data) => {
      this.getalloutboundrequests();
      this.toastr.error('Connection request cancelled');
    });
  }
}
