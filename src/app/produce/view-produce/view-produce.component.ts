import { Component, OnInit } from '@angular/core';
import { ProduceService } from 'src/app/services/produce.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ProduceModel } from '../../models/produce-model';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  faPenToSquare,
  faAppleWhole,
  faSeedling,
  faCircleMinus,
  faEye,
} from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { throwError } from 'rxjs';
import { UpdateProducePayload } from './update-produce.payload';
import * as L from 'leaflet';
import { CommentService } from 'src/app/services/comment.service';
import { ProduceCommentModel } from 'src/app/models/comment/produce-comment-model';
import Swal from 'sweetalert2';
import { FormControl, FormGroup, Validators } from '@angular/forms';

var greenIcon = L.icon({
  iconUrl: '/assets/images/Icon.png',
  shadowUrl: 'assets/marker-shadow.png',
  iconSize: [88, 104], // size of the icon
  shadowSize: [80, 104], // size of the shadow
  iconAnchor: [44, 104], // point of the icon which will correspond to marker's location
  shadowAnchor: [24, 107], // the same for the shadow
  popupAnchor: [1, -90], // point from which the popup should open relative to the iconAnchor
});

var redIcon = L.icon({
  iconUrl: '/assets/images/lock.png',

  iconSize: [38, 95], // size of the icon
  shadowSize: [50, 64], // size of the shadow
  iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
  shadowAnchor: [4, 62], // the same for the shadow
  popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
});

@Component({
  selector: 'app-view-produce',
  templateUrl: './view-produce.component.html',
  styleUrls: ['./view-produce.component.css'],
})
export class ViewProduceComponent implements OnInit {
  private map;
  comments$: Array<ProduceCommentModel>;
  latitude;
  longitude;
  produceRequestPayload: UpdateProducePayload;
  faPenToSquare = faPenToSquare;
  faAppleWhole = faAppleWhole;
  faSeedling = faSeedling;
  faCircleMinus = faCircleMinus;
  faEye = faEye;
  closeResult: string;
  isError: boolean;
  showModal: boolean;
  produce: ProduceModel = new ProduceModel();
  updateForm: FormGroup;

  constructor(
    private _produceService: ProduceService,
    private _commentService: CommentService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) {
    var container = L.DomUtil.get('map');
    if (container != null) {
      container.outerHTML = ''; // Clear map generated HTML
      // container._leaflet_id = null; << didn't work for me
    }

    this.produceRequestPayload = {
      produceId: 0,
      produceName: '',
      description: '',
      produceStatus: '',
      price: '',
      category: '',
      address: '',
      longitude: '',
      latitude: '',
      publishStatus: '',
      measureType: '',
    };
  }

  ngOnInit(): void {
    const isIdPresent = this._activatedRoute.snapshot.paramMap.has('produceId');
    if (isIdPresent) {
      const produceId = Number(
        this._activatedRoute.snapshot.paramMap.get('produceId')
      );
      this._produceService.getProducebyId(produceId).subscribe((data) => {
        console.log(data);
        this.produce = data;
        console.log(this.produce);
        const latitude = data.latitude;
        const longitude = data.longitude;
        this.initMap(latitude, longitude);
        this.initForm();
      });
      this.getCommentsForProduce(produceId);
    }
  }

  private initForm() {
    this.updateForm = new FormGroup({
      produceName: new FormControl(
        this.produce.produceName,
        Validators.required
      ),
      measureType: new FormControl(
        this.produce.measureType,
        Validators.required
      ),
      category: new FormControl(this.produce.category, Validators.required),
      description: new FormControl(
        this.produce.description,
        Validators.required
      ),
      price: new FormControl(this.produce.price, Validators.required),
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

  getCommentsForProduce(produceId) {
    this._commentService.getCommentsByProduce(produceId).subscribe((data) => {
      console.log(data);
      this.comments$ = data;
    });
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
        this.toastr.error('Error during produce update');
      }
    );
  }
  editPublishStatus(produceId, status) {
    this._produceService.editPublishStatus(produceId, status).subscribe(
      (data) => {
        this.isError = false;
        this.toastr.info('Visibilty to consumers changed');

        this._produceService
          .getProducebyId(produceId)
          .subscribe((data) => (this.produce = data));
      },
      (error) => {
        this.isError = true;
        throwError(error);
        this.toastr.error('Error during produce update');
      }
    );
  }

  open(content) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  show() {
    this.showModal = true; // Show-Hide Modal Check
  }
  //Bootstrap Modal Close event
  hide() {
    this.showModal = false;
  }

  update(submitBtn) {
    Swal.fire({
      title: 'Are you sure want to update ?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      confirmButtonColor: '#8EB540',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.value) {
        this.produceRequestPayload.produceId = this.produce.produceId;
        this.produceRequestPayload.produceName =
          this.updateForm.get('produceName')?.value;
        this.produceRequestPayload.description =
          this.updateForm.get('description')?.value;
        this.produceRequestPayload.category =
          this.updateForm.get('category')?.value;
        this.produceRequestPayload.measureType =
          this.updateForm.get('measureType')?.value;
        this.produceRequestPayload.price = this.updateForm.get('price')?.value;

        this._produceService
          .updateProduce(this.produceRequestPayload)
          .subscribe(
            (data) => {
              this._produceService
                .getProducebyId(this.produce.produceId)
                .subscribe((data) => (this.produce = data));
              this.isError = false;
              Swal.fire({
                title: 'Updated',
                icon: 'success',
                showConfirmButton: false,
                timer: 1500,
              });
              this.modalService.dismissAll();
            },
            (error) => {
              this.isError = true;
              throwError(error);
              this.toastr.error('Error during produce update');
            }
          );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', '', 'error');
      }
    });
  }
}
