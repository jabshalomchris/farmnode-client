import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SubscriptionService } from '../../services/subscription.service';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { UsersService } from 'src/app/services/users.service';
import { ProducerModel } from 'src/app/models/users/producer.model';

@Component({
  selector: 'app-my-subscriptions',
  templateUrl: './my-subscriptions.component.html',
  styleUrls: ['./my-subscriptions.component.css'],
})
export class MySubscriptionsComponent implements OnInit {
  faLocationDot = faLocationDot;
  data: object;
  jsonObj: object;
  isEmptyboolean: boolean;
  user: ProducerModel = new ProducerModel();

  constructor(
    private _subscriptionService: SubscriptionService,
    private toastr: ToastrService,
    private _userService: UsersService
  ) {}

  ngOnInit(): void {
    this.getSubscriptions();
    this.checkifEmpty();
    this.getUsersDetail();

    // const valueToGiveToNgFor = this.groupBy(this.data, 'grower'); // 'workT' is by you want to groupBy values
  }

  checkifEmpty() {}

  private getUsersDetail() {
    this._userService.getUsersDetail().subscribe((data) => {
      this.user = data;
      console.log(this.user);
    });
  }

  getSubscriptions() {
    this._subscriptionService.getMySubscriptions().subscribe((data) => {
      const valueToGiveToNgFor = this.groupBy(data, 'userName');
      if (Object.keys(valueToGiveToNgFor).length === 0) {
        this.isEmptyboolean = true;
      } else {
        this.isEmptyboolean = false;
      }
      console.log(this.isEmptyboolean);

      console.log(valueToGiveToNgFor);
      this.data = valueToGiveToNgFor;
      // this.jsonObj = {
      //   '1': [
      //     { title: 'title1', desc: 'desc1' },
      //     { title: 'title1', desc: 'sdswdw' },
      //   ],
      //   '2': [{ title: 'title2', desc: 'desc2' }],
      //   '3': [{ title: 'title3', desc: 'desc3' }],
      //   '4': [{ title: 'title4', desc: 'desc4' }],
      //   '5': [{ title: 'title5', desc: 'desc5' }],
      // };
      // console.log(this.jsonObj);
    });
  }

  // define function that will manage it
  groupBy = function (xs, key) {
    return xs.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };

  unsubscribe(produceId) {
    this._subscriptionService.unsubscribe(produceId).subscribe(
      (data) => {
        this.toastr.error('You have unsubscribed produce');

        this.getSubscriptions();
      },
      (error) => {
        this.toastr.info('Error during unsubscription');
      }
    );
  }
}
