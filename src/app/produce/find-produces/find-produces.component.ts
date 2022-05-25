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
  private map;
  private geoJsonLayer;
  northeast_lat: string;
  longitude: string;
  private northeast_long;
  private southwest_lat;
  private southwest_long;
  user;
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
    };
  }

  ngOnInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.markerClusterGroup = L.markerClusterGroup({
      removeOutsideVisibleBounds: true,
      maxClusterRadius: 5,
      spiderfyDistanceMultiplier: 2,
      spiderLegPolylineOptions: { weight: 1.5, color: '#222', opacity: 0.5 },
    });
    this.map = L.map('map').setView([6.927079, 79.861243], 14);

    //Google Maps
    const mainLayer = L.tileLayer(
      'http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
      {
        minZoom: 10,
        maxZoom: 18,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
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

    this.northeast_lat = this.map.getBounds().getNorthEast().lat;
    this.northeast_long = this.map.getBounds().getNorthEast().lng;
    this.southwest_lat = this.map.getBounds().getSouthWest().lat;
    this.southwest_long = this.map.getBounds().getSouthWest().lng;

    this.fillMap(
      this.southwest_lat,
      this.northeast_lat,
      this.southwest_long,
      this.northeast_long
    );

    this.getProducesbyFilter(
      this.southwest_lat,
      this.northeast_lat,
      this.southwest_long,
      this.northeast_long
    );

    // /////important
    this.map.on('dragend', (e) => {
      if (this.geoJsonLayer) {
        this.markerClusterGroup.removeLayer(this.geoJsonLayer);
        console.log('dragend'); // get the coordinates

        this.northeast_lat = this.map.getBounds().getNorthEast().lat;
        this.northeast_long = this.map.getBounds().getNorthEast().lng;
        this.southwest_lat = this.map.getBounds().getSouthWest().lat;
        this.southwest_long = this.map.getBounds().getSouthWest().lng;

        this.fillMap(
          this.southwest_lat,
          this.northeast_lat,
          this.southwest_long,
          this.northeast_long
        );
        this.getProducesbyFilter(
          this.southwest_lat,
          this.northeast_lat,
          this.southwest_long,
          this.northeast_long
        );
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

        this.fillMap(
          this.southwest_lat,
          this.northeast_lat,
          this.southwest_long,
          this.northeast_long
        );

        this.getProducesbyFilter(
          this.southwest_lat,
          this.northeast_lat,
          this.southwest_long,
          this.northeast_long
        );
      }
    });
  }

  private fillMap(
    southwest_lat,
    northeast_lat,
    southwest_long,
    northeast_long
  ): void {
    let router: any = this.router;
    let user: any = this.user;
    this.findProducePayload.sw_lat = southwest_lat;
    this.findProducePayload.ne_lat = northeast_lat;
    this.findProducePayload.sw_lng = southwest_long;
    this.findProducePayload.ne_lng = northeast_long;

    this.mappingService.getMap(this.findProducePayload).subscribe(
      (data) => {
        console.log(data);

        this.geoJsonLayer = L.geoJSON(data, {
          pointToLayer: function (feature, latlng) {
            var statusString;

            if (feature.properties.produceStatus == 'RIPE') {
              statusString =
                '<div style="z-index: 10;position: absolute;  left: -16px !important;top: 2 !important;"><img src="/assets/images/s-ripe.png" loading="lazy"></div>';
            } else if (feature.properties.produceStatus == 'GROWING') {
              statusString =
                '<div style="z-index: 10;position: absolute;  left: -16px !important;top: 2 !important;"><img src="/assets/images/s-growing.png" loading="lazy"></div>';
            }
            if (feature.properties.category == 'Vegetable') {
              var marker = L.marker(latlng, { icon: greenIcon });
            } else {
              var marker = L.marker(latlng, { icon: redIcon });
            }

            var popup = L.popup({
              maxWidth: 301,
            }).setContent(
              '<div class="card" style="width: 240px">' +
                '<div class="card-header text-center">' +
                statusString +
                '<h4 >' +
                feature.properties.Name +
                '</h4>' +
                '</div>' +
                '<div class="card-body">' +
                '<div class="container">' +
                '<div class="row text-center">' +
                '<div class="col-md-2 mb-2">' +
                '<img class="rounded-circle" alt="100x100" loading="lazy" style="height:60px" src="https://mdbootstrap.com/img/Photos/Avatars/img%20(30).jpg" data-holder-rendered="true">' +
                '</div>' +
                '<div class="col">' +
                '<h6 class="text-muted mb-0">' +
                feature.properties.category +
                '</h6>' +
                '<p >' +
                feature.properties.description +
                '</p>' +
                "<a id='routingButton'" +
                ' class="btn btn-warning">View</a>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>'
            );
            if (feature.properties.grower == user) {
              return marker.bindPopup(popup).on('popupopen', () => {
                const button = document.getElementById('routingButton');
                button?.addEventListener(
                  'click',
                  () => {
                    console.log('button clicked' + feature.id);
                    router.navigateByUrl('/viewproduce/' + feature.id);
                  },
                  { once: true }
                );
              });
            } else {
              return marker.bindPopup(popup).on('popupopen', () => {
                const button = document.getElementById('routingButton');
                button?.addEventListener(
                  'click',
                  () => {
                    console.log('button clicked' + feature.id);
                    router.navigateByUrl('/produce/' + feature.id);
                  },
                  { once: true }
                );
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
        //       console.log('button clicked' + e.popup._source.feature.id);
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

  private navigate() {}

  private getProducesbyFilter(
    southwest_lat,
    northeast_lat,
    southwest_long,
    northeast_long
  ) {
    this.findProducePayload.sw_lat = southwest_lat;
    this.findProducePayload.ne_lat = northeast_lat;
    this.findProducePayload.sw_lng = southwest_long;
    this.findProducePayload.ne_lng = northeast_long;

    this.produceService
      .getProducesbyFilter(this.findProducePayload)
      .subscribe((produce) => {
        this.produces$ = produce;
        if (!Object.keys(produce).length) {
          this.toastr.warning(
            'Sorry there are no produces based on this area and your search filters'
          );
        }
      });
  }

  disp_details() {
    console.log();
    console.log('Name');
  }
}
