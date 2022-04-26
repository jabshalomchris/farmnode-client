import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-mapping',
  templateUrl: './mapping.component.html',
  styleUrls: ['./mapping.component.css']
})
export class MappingComponent implements AfterViewInit {
  
  private map;

  constructor() { }

  ngAfterViewInit(): void {
    this.initMap();
    
  }
  private initMap(): void{
    this.map = L.map('map').setView([7.8731,80.7718],15);

    const mainLayer = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
      minZoom: 1,
      maxZoom: 17,subdomains:['mt0','mt1','mt2','mt3']
    });
    mainLayer.addTo(this.map);
    
    var marker = L.marker(new L.LatLng(53.471, 18.744), {
      draggable: true
      }).addTo(this.map);
  }

}
