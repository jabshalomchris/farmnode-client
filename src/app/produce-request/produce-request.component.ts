import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProduceService } from '../services/produce.service';
import { ProduceModel } from '../models/produce-model';
import { MessengerService } from '../services/messenger.service';
import { RequestItem } from '../models/request-item-model';
import { ProduceRequestModel } from '../models/produce-request-model';
import { ToastrService } from 'ngx-toastr';
import { UsersService } from '../services/users.service';
import { RequestService } from '../services/request.service';
import { finalize } from 'rxjs';
import { ProduceRequestPayload } from './request.payload';
import { FormControl, FormGroup } from '@angular/forms';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-produce-request',
  templateUrl: './produce-request.component.html',
  styleUrls: ['./produce-request.component.css'],
})
export class ProduceRequestComponent implements OnInit {
  createRequestForm: FormGroup;
  data;
  produces$: Array<ProduceRequestModel>;
  productItem: ProduceModel;
  lineTotal;
  total;
  requestItems: RequestItem[] = [];
  produceRequestPayload: ProduceRequestPayload;
  growerId;
  growerName;
  growerFirstName;

  constructor(
    private route: ActivatedRoute,
    private _produceService: ProduceService,
    private _requestService: RequestService,
    private _userService: UsersService,
    private msg: MessengerService,
    private toastr: ToastrService,
    private viewportScroller: ViewportScroller
  ) {
    this.produceRequestPayload = {
      requestStatus: '',
      requestItem: this.requestItems,
      growerId: '',
      message: '',
    };
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.data = params;
    });
    this.growerId = this.data.userId;
    this.getProducesofUser(this.data.userId);
    this.getProduce(this.data.produceId);

    this.initForm();
  }

  private initForm() {
    this.createRequestForm = new FormGroup({
      message: new FormControl(''),
    });
  }

  getProducesofUser(userId) {
    this._produceService
      .getProducesbyUserIdForRequest(userId)
      .subscribe((produce) => {
        this.produces$ = produce;
        this.growerName = produce[0].grower;
        let x = this.growerName.split(' ');
        this.growerFirstName = x[0];
        console.log(this.produces$);
      });
  }

  getProduce(produceId) {
    this._produceService.getProducebyId(produceId).subscribe((produce) => {
      this.handleAddRequest(produce);
    });
  }

  handleAddRequest(produce) {
    let productExists = false;

    for (let i in this.requestItems) {
      this.toastr.success(
        produce.produceName + ' quantity updated in the request list'
      );
      if (this.requestItems[i].produceId === produce.produceId) {
        this.requestItems[i].quantity++;
        this.calcLineTotal(this.requestItems[i].produceId);
        productExists = true;
        break;
      }
    }

    if (!productExists) {
      this.toastr.success(
        "You've added " + produce.produceName + ' to the request list'
      );
      this.requestItems.push(new RequestItem(produce));
    }

    // var removeIndex = this.produces$
    //   .map(function (item) {
    //     return item.produceId;
    //   })
    //   .indexOf(produce.produceId);

    // this.produces$.splice(removeIndex, 1);
    this.calcRequestTotal();
    console.log(this.requestItems);
  }

  quantityChange(e, produceId) {
    if (e.target.value != '') {
      for (let i in this.requestItems) {
        if (this.requestItems[i].produceId === produceId) {
          this.requestItems[i].quantity = Number(e.target.value);
          console.log('changed');
          console.log(this.requestItems);
        }
      }
      this.calcLineTotal(produceId);
      this.calcRequestTotal();
    }
  }

  calcLineTotal(produceId) {
    for (let i in this.requestItems) {
      if (this.requestItems[i].produceId === produceId) {
        this.requestItems[i].linetotal =
          this.requestItems[i].quantity * this.requestItems[i].price;
      }
    }
  }

  calcRequestTotal() {
    this.total = 0;
    this.requestItems.forEach((item) => {
      this.total += item.quantity * item.price;
    });
  }

  submit(submitBtn) {
    submitBtn.disabled = true;
    this.produceRequestPayload.growerId = this.growerId;
    this.produceRequestPayload.requestItem = this.requestItems;
    this.produceRequestPayload.message =
      this.createRequestForm.get('message')?.value;

    this._requestService
      .addRequest(JSON.stringify(this.produceRequestPayload))
      .pipe(
        finalize(() => {
          submitBtn.disabled = false;
        })
      )
      .subscribe(
        (data) => {
          this.initForm();
          this.total = 0;
          this.requestItems = [];
          this.toastr.success('Requested successfully');
          this.viewportScroller.scrollToPosition([0, 0]);
        },
        (error) => {
          this.toastr.warning('Error while making request');
        }
      );
    submitBtn.disabled = false;
  }
}
