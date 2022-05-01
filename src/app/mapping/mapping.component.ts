import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import * as geojson from 'geojson';

@Component({
  selector: 'app-mapping',
  templateUrl: './mapping.component.html',
  styleUrls: ['./mapping.component.css']
})
export class MappingComponent implements AfterViewInit {
  
  private map;
  markerClusterGroup: L.MarkerClusterGroup;
  markerClusterData = [];

  constructor() { }

  ngAfterViewInit(): void {
    this.initMap();
    
  }
  private initMap(): void{
    this.markerClusterGroup = L.markerClusterGroup({removeOutsideVisibleBounds: true});

    this.map = L.map('map').setView([6.971146721051619, 79.85890895726826],16);

    //Google Maps
    // const mainLayer = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
    //   minZoom: 1,
    //   maxZoom: 17,subdomains:['mt0','mt1','mt2','mt3']
    // });
    // mainLayer.addTo(this.map);

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);
    
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
      var GeoJson : geojson.FeatureCollection = { "type": "FeatureCollection", "features": [ { "type": "Feature", "properties": {"Name":"David"}, "geometry": { "type": "Point", "coordinates": [ 79.86843824386597, 6.963606397102782 ] } }, { "type": "Feature", "properties": {}, "geometry": { "type": "Point", "coordinates": [ 79.86645340919493, 6.961678798653075 ] } }, { "type": "Feature", "properties": {}, "geometry": { "type": "Point", "coordinates": [ 79.87159252166748, 6.965267746317486 ] } }, { "type": "Feature", "properties": {}, "geometry": { "type": "Point", "coordinates": [ 79.85886812210083, 6.949655091544542 ] } }, { "type": "Feature", "properties": {}, "geometry": { "type": "Point", "coordinates": [ 79.86431837081908, 6.95954884640577 ] } }, { "type": "Feature", "properties": {}, "geometry": { "type": "Point", "coordinates": [ 79.87163543701172, 6.958164372261742 ] } }, { "type": "Feature", "properties": {}, "geometry": { "type": "Point", "coordinates": [ 79.87524032592773, 6.959293251486512 ] } }, { "type": "Feature", "properties": {}, "geometry": { "type": "Point", "coordinates": [ 79.86745119094849, 6.949261041019517 ] } } ] }
      var geoJsonLayer = L.geoJSON(GeoJson, {
        onEachFeature: function(feature, layer){
          layer.bindPopup(feature.properties.Name);
          
        }
      });
      
      this.markerClusterGroup.addLayer(geoJsonLayer);
      this.map.addLayer(this.markerClusterGroup);
      
  }

}
