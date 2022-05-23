import { Component, OnInit } from '@angular/core';
import { ProduceService } from 'src/app/services/produce.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ProduceModel } from '../../models/produce-model';
import {
  faPenToSquare,
  faAppleWhole,
  faSeedling,
  faCircleMinus,
} from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { throwError } from 'rxjs';
import { UpdateProduceModel } from '../../models/update.Produce.module';

@Component({
  selector: 'app-view-produce',
  templateUrl: './view-produce.component.html',
  styleUrls: ['./view-produce.component.css'],
})
export class ViewProduceComponent implements OnInit {
  faPenToSquare = faPenToSquare;
  faAppleWhole = faAppleWhole;
  faSeedling = faSeedling;
  faCircleMinus = faCircleMinus;
  isError: boolean;

  produce: ProduceModel = new ProduceModel();

  constructor(
    private _produceService: ProduceService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const isIdPresent = this._activatedRoute.snapshot.paramMap.has('produceId');
    if (isIdPresent) {
      const produceId = Number(
        this._activatedRoute.snapshot.paramMap.get('produceId')
      );
      this._produceService
        .getProducebyId(produceId)
        .subscribe((data) => (this.produce = data));
    }
  }

  editStatus(produceId, status) {
    this._produceService.editStatus(produceId, status).subscribe(
      (data) => {
        this.isError = false;
        this.toastr.info('Produce status changed to ' + status + ' status !');

        this._produceService
          .getProducebyId(produceId)
          .subscribe((data) => (this.produce = data));
      },
      (error) => {
        this.isError = true;
        throwError(error);
        this.toastr.error('Login unsuccessful');
      }
    );
  }
  editPublishStatus() {}
}
