import { UsersService } from '../../services/users.service';
import { ProducerModel } from '../../models/users/producer.model';
import { FriendService } from '../../services/friend.service';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-view-grower',
  templateUrl: './view-grower.component.html',
  styleUrls: ['./view-grower.component.css'],
})
export class ViewGrowerComponent implements OnChanges {
  @Input() growerUsername: string;
  grower: ProducerModel = new ProducerModel();

  constructor(
    private _userService: UsersService,
    private _friendService: FriendService,
    private toastr: ToastrService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    for (const propName in changes) {
      if (changes[propName].currentValue) {
        let change = changes[propName];
        switch (propName) {
          case 'growerUsername': {
            this.getGrowerdetail(change.currentValue);
          }
        }
      }
    }
  }

  private getGrowerdetail(input: string) {
    this._userService.getGrowerdetails(input).subscribe((data) => {
      this.grower = data;
      console.log(this.grower);
    });
  }

  addFriends(friendId) {
    this._friendService.addFriend(friendId).subscribe((data) => {
      this.getGrowerdetail(this.growerUsername);
      this.toastr.info('Friend request sent to' + this.grower.name);
    });
  }
}
