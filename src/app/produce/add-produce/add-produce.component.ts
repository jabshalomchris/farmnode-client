import { Component, HostListener, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { GeoSearchControl, GoogleProvider } from 'leaflet-geosearch';
import * as L from 'leaflet';
import { icon, marker, Marker } from 'leaflet';
import { Title } from '@angular/platform-browser';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AddProducePayload } from './add-produce.payload';
import { ProduceService } from '../../services/produce.service';
import { ActivatedRoute, Router } from '@angular/router';
import { throwError } from 'rxjs';

var greenIcon = L.icon({
  iconUrl: '/assets/images/Icon.png',
  shadowUrl: 'assets/marker-shadow.png',
  iconSize: [88, 104], // size of the icon
  shadowSize: [80, 104], // size of the shadow
  iconAnchor: [44, 104], // point of the icon which will correspond to marker's location
  shadowAnchor: [24, 107], // the same for the shadow
  popupAnchor: [1, -90], // point from which the popup should open relative to the iconAnchor
});
Marker.prototype.options.icon = greenIcon;

@Component({
  selector: 'app-add-produce',
  templateUrl: './add-produce.component.html',
  styleUrls: ['./add-produce.component.css'],
})
export class AddProduceComponent implements OnInit {
  produceRequestPayload: AddProducePayload;
  createProduceForm: FormGroup;
  closeResult: string;
  private marker;
  private map;
  private searchControl;
  latitude: string;
  longitude: string;
  isError: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private titleService: Title,
    private produceService: ProduceService
  ) {
    var container = L.DomUtil.get('map');
    if (container != null) {
      container.outerHTML = ''; // Clear map generated HTML
      // container._leaflet_id = null; << didn't work for me
    }
    this.titleService.setTitle('Create my produce | Farmnode');
    this.produceRequestPayload = {
      produceName: '',
      description: '',
      produceStatus: '',
      price: '',
      category: '',
      address: '',
      longitude: '',
      latitude: '',
      publishStatus: '',
    };
  }

  ngOnInit(): void {
    this.createProduceForm = new FormGroup({
      produceName: new FormControl('', Validators.required),
      inputCategory: new FormControl('', Validators.required),
      produceDescription: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      produceStatus: new FormControl('', Validators.required),
      price: new FormControl('', Validators.required),
      inputMeasurement: new FormControl('', Validators.required),
    });
    this.initMap();
  }

  private initMap(): void {
    var osmUrl = 'http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';
    // init map
    this.map = L.map('map');

    // Ask for current location and navigate to that area
    this.map.locate({ setView: true, maxZoom: 16 });
    //Google Maps
    const mainLayer = L.tileLayer(
      'http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
      {
        minZoom: 1,
        maxZoom: 17,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        attribution: '&copy; <a href="">Google Maps</a>',
      }
    );
    mainLayer.addTo(this.map);

    // // add search control https://github.com/smeijer/leaflet-geosearch
    const provider = new GoogleProvider({
      params: {
        key: 'AIzaSyA62Y9p2gdgelNN7eN7qaIjc1pCVDJYKUo',
      },
    });

    // add search control https://github.com/smeijer/leaflet-geosearch

    const searchControl = new (GeoSearchControl as any)({
      provider: provider,
      style: 'bar',
      showMarker: true, // optional: true|false  - default true
      showPopup: false, // optional: true|false  - default false
      marker: {
        // optional: L.Marker    - default L.Icon.Default
        icon: greenIcon,
        draggable: true,
      },
      popupFormat: ({ query, result }) => result.label, // optional: function    - default returns result label,
      resultFormat: ({ result }) => result.label, // optional: function    - default returns result label
      maxMarkers: 1, // optional: number      - default 1
      retainZoomLevel: false, // optional: true|false  - default false
      animateZoom: true, // optional: true|false  - default true
      autoClose: false, // optional: true|false  - default false
      searchLabel: 'Look up your address', // optional: string      - default 'Enter address'
      keepResult: true, // optional: true|false  - default false
      updateMap: true, // optional: true|false  - default true
    });

    // /////important
    this.map.on('click', (e) => {
      if (this.marker) {
        this.map.removeLayer(this.marker);
      }
      var toplayerObj = e.target._layers;
      if (Object.keys(toplayerObj).length == 3) {
        var newdd = toplayerObj[Object.keys(toplayerObj)[2]]._leaflet_id;

        // this.map.eachLayer((layer) => {
        //   console.log(layer);
        //   if ((newdd = layer._leaflet_id)) {
        //     layer.remove();
        //   }
        // });
      }

      this.marker = L.marker([e.latlng.lat, e.latlng.lng], {
        icon: greenIcon,
        draggable: true,
      }).addTo(this.map); // add the marker onclick
      this.latitude = e.latlng.lat;
      this.longitude = e.latlng.lng;

      console.log(this.latitude); // get the coordinates
      console.log(this.longitude); // get the coordinates
    });

    this.map.on('geosearch/showlocation', (result) => {
      if (this.marker) {
        this.map.removeLayer(this.marker);
      }
      this.latitude = result.location.y;
      this.longitude = result.location.x;
      console.log(this.latitude);
      console.log(this.longitude);
    });

    this.map.on('geosearch/marker/dragend', (event) => {
      var latlngObj = event.target._layers;

      var latlng = latlngObj[Object.keys(latlngObj)[2]]._latlng;

      this.latitude = latlng[Object.keys(latlng)[0]];
      this.longitude = latlng[Object.keys(latlng)[1]];

      console.log(this.latitude);
      console.log(this.longitude);
    });

    this.map.addControl(searchControl);
  }

  submit() {
    this.produceRequestPayload.produceName =
      this.createProduceForm.get('produceName')?.value;
    this.produceRequestPayload.description =
      this.createProduceForm.get('description')?.value;
    this.produceRequestPayload.category =
      this.createProduceForm.get('inputCategory')?.value;
    this.produceRequestPayload.latitude = this.latitude;
    this.produceRequestPayload.longitude = this.longitude;
    this.produceRequestPayload.price =
      this.createProduceForm.get('price')?.value;
    this.produceRequestPayload.produceStatus =
      this.createProduceForm.get('produceStatus')?.value;
    this.produceRequestPayload.publishStatus = 'true';

    this.produceService.addProduce(this.produceRequestPayload).subscribe(
      (data) => {
        this.isError = false;
        this.toastr.success('Produce added successfully');
        this.router.navigateByUrl('/');

        //console.log('Login Successful')
      },
      (error) => {
        this.isError = true;
        throwError(error);
        this.toastr.error('Login unsuccessful');
      }
    );

    console.log(this.produceRequestPayload);
  }
  leave() {
    if (this.map) {
      this.map.remove();
    }
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
}
