import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { ProduceService } from '../../services/produce.service';
import { ProducerModel } from 'src/app/models/users/producer.model';
import { ProduceRequestModel } from 'src/app/models/produce-request-model';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.css'],
})
export class ViewUserComponent implements OnInit {
  userId;
  grower: ProducerModel = new ProducerModel();
  produces$: Array<ProduceRequestModel>;

  constructor(
    private _userservice: UsersService,
    private _produceService: ProduceService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const isIdPresent = this._activatedRoute.snapshot.paramMap.has('userId');
    if (isIdPresent) {
      this.userId = Number(
        this._activatedRoute.snapshot.paramMap.get('userId')
      );
      this.getGrowerdetail(this.userId);
    }
  }

  private getGrowerdetail(input: number) {
    this._userservice.getGrowerdetailsById(input).subscribe((data) => {
      this.grower = data;
      console.log(this.grower);
      this.getProducesofUser(this.grower.userId);
    });
  }

  getProducesofUser(userId) {
    this._produceService.getProducesbyUserId(userId).subscribe((produce) => {
      this.produces$ = produce.slice(0, 10);
      console.log(this.produces$);
    });
  }
}
