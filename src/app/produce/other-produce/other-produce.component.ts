import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from 'ngx-webstorage';
import { ProduceService } from 'src/app/services/produce.service';
import { ProduceModel } from '../../models/produce-model';
import * as L from 'leaflet';
import { SubscriptionService } from '../../services/subscription.service';
import { finalize, throwError } from 'rxjs';
import { CommentService } from '../../services/comment.service';
import { ProduceCommentModel } from '../../models/comment/produce-comment-model';
import { CommentPayload } from './comment.payload';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-other-produce',
  templateUrl: './other-produce.component.html',
  styleUrls: ['./other-produce.component.css'],
})
export class OtherProduceComponent implements OnInit {
  showModalBox: boolean = false;

  private map;
  produce: ProduceModel = new ProduceModel();
  comments$: Array<ProduceCommentModel>;
  user;
  isError: boolean;
  commentPayload: CommentPayload;
  commentForm: FormGroup;
  produceId;
  showModal: boolean;

  constructor(
    private _produceService: ProduceService,
    private _commentService: CommentService,
    private _subscriptionService: SubscriptionService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private localStorage: LocalStorageService
  ) {
    this.commentPayload = {
      text: '',
      produceId: 0,
    };
  }

  ngOnInit(): void {
    const isIdPresent = this._activatedRoute.snapshot.paramMap.has('produceId');
    if (isIdPresent) {
      this.produceId = Number(
        this._activatedRoute.snapshot.paramMap.get('produceId')
      );
      this.getProducebyId();
      this.getCommentsForProduce(this.produceId);
    }

    this.commentForm = new FormGroup({
      text: new FormControl('', Validators.required),
    });
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

  getProducebyId() {
    this._produceService.getProducebyId(this.produceId).subscribe((data) => {
      this.produce = data;
      const latitude = data.latitude;
      const longitude = data.longitude;
      this.initMap(latitude, longitude);
    });
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
        this.toastr.error('You have unsubscribed produce');

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

  postComment(submitBtn) {
    submitBtn.disabled = true;
    this.commentPayload.text = this.commentForm.get('text')?.value;
    this.commentPayload.produceId = this.produce.produceId;

    this._commentService
      .addProduceComment(this.commentPayload)
      .pipe(
        finalize(() => {
          submitBtn.disabled = false;
        })
      )
      .subscribe(
        (data) => {
          this.isError = false;
          this.commentForm.reset();
          this.toastr.success('Comment added successfully');
          this.getCommentsForProduce(this.produceId);
        },
        (error) => {
          this.isError = true;
          throwError(error);
          this.toastr.error('Commenting failed');
        }
      );
    submitBtn.disabled = false;
  }

  getCommentsForProduce(produceId) {
    this._commentService.getCommentsByProduce(produceId).subscribe((data) => {
      console.log(data);
      this.comments$ = data;
    });
  }

  show() {
    this.showModal = true; // Show-Hide Modal Check
  }
  //Bootstrap Modal Close event
  hide() {
    this.showModal = false;
  }
}
