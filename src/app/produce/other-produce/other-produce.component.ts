import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from 'ngx-webstorage';
import { ProduceService } from 'src/app/services/produce.service';
import { ProduceModel } from '../../models/produce-model';
import * as L from 'leaflet';
import { SubscriptionService } from '../../services/subscription.service';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-other-produce',
  templateUrl: './other-produce.component.html',
  styleUrls: ['./other-produce.component.css'],
})
export class OtherProduceComponent implements OnInit {
  private map;
  produce: ProduceModel = new ProduceModel();
  user;
  isError: boolean;

  constructor(
    private _produceService: ProduceService,
    private _subscriptionService: SubscriptionService,
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
        console.log(data);
        this.produce = data;
        const latitude = data.latitude;
        const longitude = data.longitude;
        this.initMap(latitude, longitude);
      });
    }
  }

  private initMap(latitude, longitude): void {
    this.map = L.map('map').setView([6.971146721051619, 79.85890895726826], 16);
    //Google Maps
    const mainLayer = L.tileLayer(
      'http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
      {
        minZoom: 1,
        maxZoom: 17,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      }
    );
    mainLayer.addTo(this.map);

    var marker = L.marker(new L.LatLng(latitude, longitude), {
      draggable: false,
    }).addTo(this.map);

    this.map.setView(marker.getLatLng(), 14);
  }

  addSubsciption(produceId) {
    this._subscriptionService.addSubscription(produceId).subscribe(
      (data) => {
        this.isError = false;
        this.toastr.success(
          'You have subscribed to ' + this.produce.produceName
        );

        this._produceService
          .getProducebyId(produceId)
          .subscribe((data) => (this.produce = data));
      },
      (error) => {
        this.isError = true;
        throwError(error);
        this.toastr.error('Error during subscribing produce');
      }
    );
  }

  unsubscribe(produceId) {
    this._subscriptionService.unsubscribe(produceId).subscribe(
      (data) => {
        this.isError = false;
        this.toastr.info('You have unsubscribed ' + this.produce.produceName);

        this._produceService
          .getProducebyId(produceId)
          .subscribe((data) => (this.produce = data));
      },
      (error) => {
        this.isError = true;
        throwError(error);
        this.toastr.error('Error during unsubscription');
      }
    );
  }
}
