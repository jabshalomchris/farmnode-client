import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from 'ngx-webstorage';
import { ProduceService } from 'src/app/services/produce.service';
import { ProduceModel } from '../../models/produce-model';

@Component({
  selector: 'app-other-produce',
  templateUrl: './other-produce.component.html',
  styleUrls: ['./other-produce.component.css'],
})
export class OtherProduceComponent implements OnInit {
  produce: ProduceModel = new ProduceModel();
  user;

  constructor(
    private _produceService: ProduceService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private localStorage: LocalStorageService
  ) {}

  ngOnInit(): void {
    const isIdPresent = this._activatedRoute.snapshot.paramMap.has('produceId');
    if (isIdPresent) {
      const produceId = Number(
        this._activatedRoute.snapshot.paramMap.get('produceId')
      );
      this._produceService.getProducebyId(produceId).subscribe((data) => {
        this.produce = data;
      });
    }
  }
}
