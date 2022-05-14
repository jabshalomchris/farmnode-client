import { Component, OnInit } from '@angular/core';
import { ProduceService } from 'src/app/services/produce.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ProduceModel } from '../../models/produce-model';

@Component({
  selector: 'app-view-produce',
  templateUrl: './view-produce.component.html',
  styleUrls: ['./view-produce.component.css'],
})
export class ViewProduceComponent implements OnInit {
  produce: ProduceModel = new ProduceModel();
  constructor(
    private _produceService: ProduceService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute
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
}
