import { Component, OnInit } from '@angular/core';
import { SubscriptionService } from '../../services/subscription.service';

@Component({
  selector: 'app-my-subscriptions',
  templateUrl: './my-subscriptions.component.html',
  styleUrls: ['./my-subscriptions.component.css'],
})
export class MySubscriptionsComponent implements OnInit {
  data: object;
  jsonObj: object;

  constructor(private _subscriptionService: SubscriptionService) {}

  ngOnInit(): void {
    this._subscriptionService.getMySubscriptions().subscribe((data) => {
      //this.data = data;
      console.log(data);
      const valueToGiveToNgFor = this.groupBy(data, 'userName');
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
      console.log(this.jsonObj);
    });
    // const valueToGiveToNgFor = this.groupBy(this.data, 'grower'); // 'workT' is by you want to groupBy values
  }

  // define function that will manage it
  groupBy = function (xs, key) {
    return xs.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };
}
