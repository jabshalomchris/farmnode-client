import { MappingService } from './../services/mapping.service';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import * as geojson from 'geojson';
import { map } from 'rxjs/operators';
import { icon, Marker } from 'leaflet';

import { ToastrService } from 'ngx-toastr';

import { HttpClient, HttpParams } from '@angular/common/http';
import { MappingPayload } from './mapping.payload';

const iconRetinaUrl = 'assets/images/Icon.png';
const iconUrl = 'assets/images/Icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [90, 95], // size of the icon
  iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
  popupAnchor: [1, -34], // point from which the popup should open relative to the iconAnchor
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41], // size of the shadow
});
Marker.prototype.options.icon = iconDefault;

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
  selector: 'app-mapping',
  templateUrl: './mapping.component.html',
  styleUrls: ['./mapping.component.css'],
})
export class MappingComponent implements OnInit {
  private marker;
  private map;
  private container;
  markerClusterGroup: L.MarkerClusterGroup;
  markerClusterData = [];
  private data;
  mapPayload: MappingPayload;
  constructor(
    private httpClient: HttpClient,
    private mappingService: MappingService,
    private toastr: ToastrService
  ) {
    var container = L.DomUtil.get('map');
    if (container != null) {
      container.outerHTML = ''; // Clear map generated HTML
      // container._leaflet_id = null; << didn't work for me
    }
    this.mapPayload = {
      sw_lat: '',
      ne_lat: '',
      sw_lng: '',
      ne_lng: '',
    };
  }

  ngOnInit() {
    this.initMap();
  }
  private initMap(): void {
    if (this.map) {
      this.map.remove();
    }
    this.markerClusterGroup = L.markerClusterGroup({
      removeOutsideVisibleBounds: true,
    });

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

    // const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //   maxZoom: 18,
    //   minZoom: 3,
    //   attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    // });

    // tiles.addTo(this.map);

    //triAL 1
    // var marker = L.marker(new L.LatLng(7.8731,80.7718), {
    //   draggable: true
    //   }).addTo(this.map).bindPopup('A pretty CSS3 popup.<br> Easily customizable.');

    //triAL 2
    // var GeoJson : geojson.FeatureCollection = { "type": "FeatureCollection", "features": [ { "type": "Feature", "properties": {}, "geometry": { "type": "Point", "coordinates": [ 79.86843824386597, 6.963606397102782 ] } }, { "type": "Feature", "properties": {}, "geometry": { "type": "Point", "coordinates": [ 79.86843824386597, 6.963606397102782   ] } }, { "type": "Feature", "properties": {}, "geometry": { "type": "Point", "coordinates": [ 79.86843824386597, 6.963606397102782 ] } }, { "type": "Feature", "properties": {}, "geometry": { "type": "Point", "coordinates": [79.86843824386597, 6.963606397102782  ] } } ] };

    // L.geoJSON(GeoJson).addTo(this.map).bindPopup('A pretty CSS3 popup.<br> Tested');

    //trial 3 with clustetr group
    // // this.markerClusterGroup.addLayer(L.marker(new L.LatLng(7.8731,80.7718)));
    // // this.markerClusterGroup.addLayer(L.marker(new L.LatLng(7.8731,80.7718)));
    // // this.markerClusterGroup.addLayer(L.marker(new L.LatLng( 6.963606397102782,79.86843824386597 )));
    // // this.map.addLayer(this.markerClusterGroup);

    //TRIAL 4 gEOjSON WITHCLSUTER
    // var GeoJson : geojson.FeatureCollection = { "type": "FeatureCollection", "features": [ { "type": "Feature", "properties": {"Name":"David"}, "geometry": { "type": "Point", "coordinates": [ 79.86843824386597, 6.963606397102782 ] } }, { "type": "Feature", "properties": {}, "geometry": { "type": "Point", "coordinates": [ 79.86645340919493, 6.961678798653075 ] } }, { "type": "Feature", "properties": {}, "geometry": { "type": "Point", "coordinates": [ 79.87159252166748, 6.965267746317486 ] } }, { "type": "Feature", "properties": {}, "geometry": { "type": "Point", "coordinates": [ 79.85886812210083, 6.949655091544542 ] } }, { "type": "Feature", "properties": {}, "geometry": { "type": "Point", "coordinates": [ 79.86431837081908, 6.95954884640577 ] } }, { "type": "Feature", "properties": {}, "geometry": { "type": "Point", "coordinates": [ 79.87163543701172, 6.958164372261742 ] } }, { "type": "Feature", "properties": {}, "geometry": { "type": "Point", "coordinates": [ 79.87524032592773, 6.959293251486512 ] } }, { "type": "Feature", "properties": {}, "geometry": { "type": "Point", "coordinates": [ 79.86745119094849, 6.949261041019517 ] } } ] }
    // var geoJsonLayer = L.geoJSON(GeoJson, {
    //   onEachFeature: function(feature, layer){
    //     layer.bindPopup(feature.properties.Name);

    //   }
    // });

    // this.markerClusterGroup.addLayer(geoJsonLayer);
    // this.map.addLayer(this.markerClusterGroup);

    // //   //TRIAL 5 gEOjSON API Working solution
    // this.mapPayload.sw_lat = '6.862391';
    // this.mapPayload.ne_lat = '79.822326';
    // this.mapPayload.sw_lng = '6.981287';
    // this.mapPayload.ne_lng = '79.890085';

    // this.mappingService.getMap(this.mapPayload).subscribe(
    //   (data) => {
    //     console.log(data);
    //     var geoJsonLayer = L.geoJSON(data, {
    //       onEachFeature: function (feature, layer) {
    //         var popup = layer.bindPopup(
    //           '<strong>Hello world!</strong><br />' + feature.properties.Name
    //         );
    //         popup.on('popupclose', function (e) {
    //           alert('Hi!');
    //         });
    //       },
    //     });
    //     this.markerClusterGroup.addLayer(geoJsonLayer);
    //     this.map.addLayer(this.markerClusterGroup);
    //   },
    //   (error) => {
    //     console.log(error);
    //     this.toastr.error(error);
    //   }
    // );

    //   //TRIAL 6 gEOjSON API

    //     const params = new HttpParams()
    //       .set('sw_lat', '6.862391')
    //       .set('ne_lat', '79.822326')
    //       .set('sw_lng', '6.981287')
    //       .set('ne_lng', "79.890085");

    //     this.httpClient.get<any>('http://localhost:8080/api/produce/geoJsonNew',{params}).subscribe(Response=>{
    //       console.log(Response);
    //       var geoJsonLayer = L.geoJSON(Response, {
    //         onEachFeature: function(feature, layer){
    //          layer.bindPopup("<strong>Hello world!</strong><br />"+feature.properties.Name);

    //        }
    //      });
    //      this.markerClusterGroup.addLayer(geoJsonLayer);
    //      this.map.addLayer(this.markerClusterGroup);
    //  }) // {params} short form of {params:params}

    //   //TRIAL 7 gEOjSON API not entirely
    this.mapPayload.sw_lat = '5.6816';
    this.mapPayload.ne_lat = '79.2677';
    this.mapPayload.sw_lng = '10.03377';
    this.mapPayload.ne_lng = '82.1448';

    this.mappingService.getMap(this.mapPayload).subscribe(
      (data) => {
        console.log(data);

        // var geoJsonLayer = L.geoJSON(data, {
        //   onEachFeature: function (feature, layer) {
        //     layer.bindPopup(
        //       '<strong>Hello world!</strong><br />' + feature.properties.Name
        //     );
        //   },
        // });

        var geoJsonLayer = L.geoJSON(data, {
          pointToLayer: function (feature, latlng) {
            if (feature.properties.category == 'Vegetable') {
              var marker = L.marker(latlng, { icon: greenIcon });
            } else {
              var marker = L.marker(latlng, { icon: redIcon });
            }
            return marker.bindPopup(
              '<div class="card text-center">' +
                '<div class="card-header">' +
                '<h3>' +
                feature.properties.Name +
                '</h3>' +
                '</div>' +
                '<div class="card-body">' +
                '<div class="row text-center">' +
                '<div class="col-md-2 mb-2">' +
                '<img class="rounded-circle" alt="100x100" loading="lazy" style="height:60px" src="https://mdbootstrap.com/img/Photos/Avatars/img%20(30).jpg" data-holder-rendered="true">' +
                '</div>' +
                '<div class="col">' +
                '<h5 class="card-title">Special title treatment</h5>' +
                '<p class="card-text">With supporting text below as a natural lead-in to additional content.</p>' +
                '<a href="#" class="btn btn-success">Button</a>' +
                '</div>' +
                '</div>' +
                '</div>'
            );
          },
        });
        //  var markers = L.markerClusterGroup({
        //    iconCreateFunction: function (cluster) {
        //      return L.divIcon({
        //        cluster.getAllChildMarkers()
        //      });
        //    },
        //  });
        //  markers.addLayer(geoJsonLayer);
        //  this.map.addLayer(markers);

        this.markerClusterGroup.addLayer(geoJsonLayer);
        this.map.addLayer(this.markerClusterGroup);
      },
      (error) => {
        console.log(error);
        this.toastr.error(error);
      }
    );

    // /////important
    // this.map.on('click', (e) => {
    //   if (this.marker) {
    //     this.map.removeLayer(this.marker);
    //   }
    //   console.log(e.latlng); // get the coordinates
    //   this.marker = L.marker([e.latlng.lat, e.latlng.lng], {
    //     icon: greenIcon,
    //   }).addTo(this.map); // add the marker onclick
    // });
  }
}
