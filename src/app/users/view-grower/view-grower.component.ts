import { ProduceService } from 'src/app/services/produce.service';
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
import { ProduceRequestModel } from 'src/app/models/produce-request-model';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-grower',
  templateUrl: './view-grower.component.html',
  styleUrls: ['./view-grower.component.css'],
})
export class ViewGrowerComponent implements OnChanges {
  faCheck = faCheck;
  @Input() growerUsername: string;
  @Input() produceId: number;
  grower: ProducerModel = new ProducerModel();
  produces$: Array<ProduceRequestModel>;
  slicedproduces$: Array<ProduceRequestModel>;

  constructor(
    private _userService: UsersService,
    private _produceService: ProduceService,
    private _friendService: FriendService,
    private toastr: ToastrService,
    private router: Router
  ) {
    // force route reload whenever params change;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

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
      this.getProducesofUser(this.grower.userId);
    });
  }

  getProducesofUser(userId) {
    this._produceService.getProducesbyUserId(userId).subscribe((produce) => {
      this.produces$ = produce;
      console.log(this.produces$);
      this.slicedproduces$ = this.produces$.slice(0, 10);
    });
  }

  addFriends(friendId) {
    this._friendService.addFriend(friendId).subscribe((data) => {
      this.getGrowerdetail(this.growerUsername);
      this.toastr.info('Friend request sent to' + this.grower.name);
    });
  }
}
