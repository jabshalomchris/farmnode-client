import { Component, Inject, OnInit } from '@angular/core';
import { icon, Marker } from 'leaflet';
import * as L from 'leaflet';
import { MappingService } from '../../services/mapping.service';
import { ToastrService } from 'ngx-toastr';
import { FindProducesPayload } from './find-produces.payload';
import { ProduceModel } from 'src/app/models/produce-model';
import { ProduceService } from 'src/app/services/produce.service';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { faHelicopterSymbol } from '@fortawesome/free-solid-svg-icons';
import { LocalStorageService } from 'ngx-webstorage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { finalize, throwError } from 'rxjs';

// Icons
var greenIcon = L.icon({
  iconUrl: '/assets/images/marker3.png',
  shadowUrl: 'assets/marker-shadow.png',
  iconSize: [100, 80], // size of the icon
  shadowSize: [100, 80], // size of the shadow
  iconAnchor: [50, 80], // point of the icon which will correspond to marker's location
  shadowAnchor: [24, 80], // the same for the shadow
  popupAnchor: [1, -90], // point from which the popup should open relative to the iconAnchor
});

var redIcon = L.icon({
  iconUrl: '/assets/images/marker.png',
  shadowUrl: 'assets/marker-shadow.png',
  iconSize: [88, 104], // size of the icon
  shadowSize: [88, 104], // size of the shadow
  iconAnchor: [44, 104], // point of the icon which will correspond to marker's location
  shadowAnchor: [24, 107], // the same for the shadow
  popupAnchor: [1, -90], // point from which the popup should open relative to the iconAnchor
});

@Component({
  selector: 'app-find-produces',
  templateUrl: './find-produces.component.html',
  styleUrls: ['./find-produces.component.css'],
})
export class FindProducesComponent implements OnInit {
  searchForm: FormGroup;
  locationsearchquery;
  isError: boolean;
  private map;
  private geoJsonLayer;
  northeast_lat: string;
  longitude: string;
  private northeast_long;
  private southwest_lat;
  private southwest_long;
  user;
  private _prevSelected: any;
  includeUsers: boolean = true;
  category = '';
  status = '';
  _;
  markerClusterGroup: L.MarkerClusterGroup;
  markerClusterData = [];
  findProducePayload: FindProducesPayload;

  produces$: Array<ProduceModel>;

  constructor(
    private mappingService: MappingService,
    private toastr: ToastrService,
    private produceService: ProduceService,
    private router: Router,
    @Inject(DOCUMENT) document: Document,
    private localStorage: LocalStorageService
  ) {
    var container = L.DomUtil.get('map');
    if (container != null) {
      container.outerHTML = ''; // Clear map generated HTML
    }
    this.user = localStorage.retrieve('username');

    this.findProducePayload = {
      sw_lat: '',
      ne_lat: '',
      sw_lng: '',
      ne_lng: '',
      category: '',
      status: '',
      includeUsers: this.includeUsers,
    };
  }

  ngOnInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.searchForm = new FormGroup({
      location: new FormControl('', Validators.required),
    });
    this.markerClusterGroup = L.markerClusterGroup({
      removeOutsideVisibleBounds: true,
      maxClusterRadius: 5,
      spiderfyDistanceMultiplier: 2,
      spiderLegPolylineOptions: { weight: 1.5, color: '#222', opacity: 0.5 },
    });
    this.map = L.map('map').setView([6.927079, 79.861243], 14);

    //Google Maps
    // const mainLayer = L.tileLayer(
    //   'http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    //   {
    //     minZoom: 10,
    //     maxZoom: 18,
    //     subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    //   }
    // );

    const mainLayer = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 18,
        minZoom: 10,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    );
    mainLayer.addTo(this.map);

    // Ask for current location and navigate to that area
    // this.map
    //   .locate({ setView: true, maxZoom: 16 })
    //   .on('locationfound', (e) => {
    //     console.log(e.bounds);
    //     this.northeast_lat = e.bounds._northEast.lat;
    //     console.log(this.northeast_lat);
    //     this.map.setView([e.latitude, e.longitude]);
    //     this.map.panTo(new L.LatLng(e.latitude, e.longitude));
    //     console.log(e.getBounds());
    //     this.map.fitBounds(e.bounds);
    //     this.map.setZoom(16);
    //   })
    //   .on('locationerror', function (e) {
    //     console.log(e);
    //     alert('Location access denied.');
    //   });

    // console.log(this.map.getBounds());

    this.fillMap();

    this.getProducesbyFilter();

    // /////important
    this.map.on('dragend', (e) => {
      if (this.geoJsonLayer) {
        this.markerClusterGroup.removeLayer(this.geoJsonLayer);
        console.log('dragend'); // get the coordinates

        this.fillMap();
        this.getProducesbyFilter();
      }
    });

    this.map.on('zoom', (e) => {
      if (this.geoJsonLayer) {
        this.markerClusterGroup.removeLayer(this.geoJsonLayer);
        console.log('zoomed'); // get the coordinates

        this.northeast_lat = this.map.getBounds().getNorthEast().lat;
        this.northeast_long = this.map.getBounds().getNorthEast().lng;
        this.southwest_lat = this.map.getBounds().getSouthWest().lat;
        this.southwest_long = this.map.getBounds().getSouthWest().lng;

        this.fillMap();

        this.getProducesbyFilter();
      }
    });
  }

  private fillMap(): void {
    let router: any = this.router;
    let user: any = this.user;

    this.findProducePayload.sw_lat = this.map.getBounds().getSouthWest().lat;
    this.findProducePayload.ne_lat = this.map.getBounds().getNorthEast().lat;
    this.findProducePayload.sw_lng = this.map.getBounds().getSouthWest().lng;
    this.findProducePayload.ne_lng = this.map.getBounds().getNorthEast().lng;
    this.findProducePayload.category = this.category;
    this.findProducePayload.status = this.status;
    this.findProducePayload.includeUsers = this.includeUsers;

    this.mappingService.getMap(this.findProducePayload).subscribe(
      (data) => {
        console.log(data);

        this.geoJsonLayer = L.geoJSON(data, {
          pointToLayer: function (feature, latlng) {
            var statusString;

            if (feature.properties.produceStatus == 'RIPE') {
              statusString =
                '<div style="z-index: 10;position: absolute;  left: -16px !important;top: 2 !important;"><img src="/assets/images/s-ripe.png" loading="lazy" ngbTooltip="Ripe"></div>';
            } else if (feature.properties.produceStatus == 'GROWING') {
              statusString =
                '<div style="z-index: 10;position: absolute;  left: -16px !important;top: 2 !important;"><img src="/assets/images/s-growing.png" loading="lazy" ngbTooltip="Growing"></div>';
            }
            if (feature.properties.category == 'Vegetable') {
              var marker = L.marker(latlng, { icon: greenIcon });
            } else {
              var marker = L.marker(latlng, { icon: redIcon });
            }

            var popup = L.popup({
              maxWidth: 290,
            }).setContent(
              '<div class="card" style="width: 240px;">' +
                '<div class="card-header text-center" style="color: #728e37; font-size: 22px; font-weight: bold">' +
                statusString +
                '<h4 >' +
                feature.properties.Name +
                '</h4>' +
                '</div>' +
                '<div class="card-body">' +
                '<div class="row">' +
                '<div class="col-6 col-sm-3">' +
                '<img class="rounded-circle" alt="100x100" loading="lazy" style="height:50px; width: 50px" src="http://localhost:8080/api/image/produce-image/' +
                feature.properties.filename +
                '" data-holder-rendered="true">' +
                '</div>' +
                '<div class="col-6 col-sm-9">' +
                '<h6 class="card-title">' +
                'Rs. ' +
                feature.properties.price +
                ' / ' +
                feature.properties.measureType +
                '</h6>' +
                '<p class="card-text" >' +
                feature.properties.description.slice(0, 30) +
                ' .....' +
                '</p>' +
                '<div style="text-align: right">' +
                "<a id='routingButton'" +
                ' class="btn btn-warning">View</a>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="card-footer text-muted"> Grower : ' +
                "<span style='color: #728e37; font-weight: 600'>" +
                feature.properties.grower +
                '</span>' +
                '</div>' +
                '</div>'
            );
            if (feature.properties.grower == user) {
              return marker.bindPopup(popup).on('popupopen', () => {
                const button = document.getElementById('routingButton');
                button?.addEventListener('click', () => {
                  console.log('button clicked' + feature.id);
                  router.navigateByUrl('/viewproduce/' + feature.id);
                });
              });
            } else {
              return marker.bindPopup(popup).on('popupopen', () => {
                const button = document.getElementById('routingButton');
                button?.addEventListener('click', () => {
                  console.log('button clicked' + feature.id);
                  router.navigateByUrl('/produce/' + feature.id);
                });
              });
            }
          },
        });

        this.markerClusterGroup.addLayer(this.geoJsonLayer);
        this.map.addLayer(this.markerClusterGroup);

        // this.map.on('popupopen', function (e) {
        //   const button = document.getElementById('popupButtonlll');

        //   button?.addEventListener(
        //     'click',
        //     () => {
        //      console.log('button clicked' + e.popup._source.feature.id);
        //     },
        //     { once: true }
        //   );
        // });
      },
      (error) => {
        console.log(error);
        this.toastr.error(error);
      }
    );
  }

  private getProducesbyFilter() {
    this.findProducePayload.sw_lat = this.map.getBounds().getSouthWest().lat;
    this.findProducePayload.ne_lat = this.map.getBounds().getNorthEast().lat;
    this.findProducePayload.sw_lng = this.map.getBounds().getSouthWest().lng;
    this.findProducePayload.ne_lng = this.map.getBounds().getNorthEast().lng;
    this.findProducePayload.category = this.category;
    this.findProducePayload.status = this.status;
    this.findProducePayload.includeUsers = this.includeUsers;

    this.produceService
      .getProducesbyFilter(this.findProducePayload)
      .subscribe((produce) => {
        this.produces$ = produce;
        console.log(produce);
        if (!Object.keys(produce).length) {
          this.toastr.warning(
            'Sorry there are no produces based on this area and your search filters'
          );
        }
      });
  }

  handleChange(evt) {
    var target = evt.target;
    if (target.checked) {
      console.log('Clickec');
      this._prevSelected = target;
    } else {
      console.log('unclicked');
    }
  }
  changeStatus(e) {
    this.status = e.target.value;
    if (e.target.checked) {
      if (this.geoJsonLayer) {
        // this.includeUsers = true;
        this.markerClusterGroup.removeLayer(this.geoJsonLayer);

        this.fillMap();

        this.getProducesbyFilter();
      }
    } else {
      if (this.geoJsonLayer) {
        // this.includeUsers = false;
        this.markerClusterGroup.removeLayer(this.geoJsonLayer);

        this.northeast_lat = this.map.getBounds().getNorthEast().lat;
        this.northeast_long = this.map.getBounds().getNorthEast().lng;
        this.southwest_lat = this.map.getBounds().getSouthWest().lat;
        this.southwest_long = this.map.getBounds().getSouthWest().lng;

        this.fillMap();
        this.getProducesbyFilter();
      }
    }
  }

  changeProduceType(e) {
    this.category = e.target.value;
    if (e.target.checked) {
      if (this.geoJsonLayer) {
        // this.includeUsers = true;
        this.markerClusterGroup.removeLayer(this.geoJsonLayer);

        this.northeast_lat = this.map.getBounds().getNorthEast().lat;
        this.northeast_long = this.map.getBounds().getNorthEast().lng;
        this.southwest_lat = this.map.getBounds().getSouthWest().lat;
        this.southwest_long = this.map.getBounds().getSouthWest().lng;

        this.fillMap();

        this.getProducesbyFilter();
      }
    } else {
      if (this.geoJsonLayer) {
        // this.includeUsers = false;
        this.markerClusterGroup.removeLayer(this.geoJsonLayer);

        this.northeast_lat = this.map.getBounds().getNorthEast().lat;
        this.northeast_long = this.map.getBounds().getNorthEast().lng;
        this.southwest_lat = this.map.getBounds().getSouthWest().lat;
        this.southwest_long = this.map.getBounds().getSouthWest().lng;

        this.fillMap();
        this.getProducesbyFilter();
      }
    }
  }

  changeSwitch(e) {
    if (e.target.checked) {
      if (this.geoJsonLayer) {
        this.includeUsers = true;
        this.markerClusterGroup.removeLayer(this.geoJsonLayer);

        this.northeast_lat = this.map.getBounds().getNorthEast().lat;
        this.northeast_long = this.map.getBounds().getNorthEast().lng;
        this.southwest_lat = this.map.getBounds().getSouthWest().lat;
        this.southwest_long = this.map.getBounds().getSouthWest().lng;

        this.fillMap();

        this.getProducesbyFilter();
      }
    } else {
      if (this.geoJsonLayer) {
        this.includeUsers = false;
        this.markerClusterGroup.removeLayer(this.geoJsonLayer);

        this.northeast_lat = this.map.getBounds().getNorthEast().lat;
        this.northeast_long = this.map.getBounds().getNorthEast().lng;
        this.southwest_lat = this.map.getBounds().getSouthWest().lat;
        this.southwest_long = this.map.getBounds().getSouthWest().lng;

        this.fillMap();
        this.getProducesbyFilter();
      }
    }
  }
  submit(submitBtn) {
    submitBtn.disabled = true;
    this.locationsearchquery = this.searchForm.get('location')?.value;
    this.mappingService
      .geocode(this.locationsearchquery)
      .pipe(
        finalize(() => {
          submitBtn.disabled = false;
        })
      )
      .subscribe(
        (data) => {
          if (data.status == 'OK') {
            this.isError = false;
            console.log(data);
            console.log(data.results[0].geometry.viewport.southwest.lat);
            console.log(data.results[0].geometry.viewport.southwest.lng);
            console.log(data.results[0].geometry.viewport.northeast.lat);
            console.log(data.results[0].geometry.viewport.northeast.lng);

            this.map.fitBounds([
              [
                data.results[0].geometry.viewport.southwest.lat,
                data.results[0].geometry.viewport.southwest.lng,
              ],
              [
                data.results[0].geometry.viewport.northeast.lat,
                data.results[0].geometry.viewport.northeast.lng,
              ],
            ]);
          } else {
            this.toastr.warning('Search location not found');
          }
        },
        (error) => {
          this.isError = true;
          throwError(error);
          this.toastr.error('Unable to geocode your location query');
        }
      );
    submitBtn.disabled = false;
  }
}
