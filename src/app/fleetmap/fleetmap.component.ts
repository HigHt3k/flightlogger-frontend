import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as L from "leaflet";
import {FormControl, FormGroup} from "@angular/forms";
import { greatCircle } from '@turf/turf';
import html2canvas from 'html2canvas';


@Component({
  selector: 'app-fleetmap',
  templateUrl: './fleetmap.component.html',
  styleUrls: ['./fleetmap.component.css']
})
export class FleetmapComponent implements AfterViewInit {

  map!: L.Map;

  private initializeMap(): void {
    this.map = L.map('map').setView([0, 0], 2);
    L.tileLayer('https://api.mapbox.com/styles/v1/johannt98/clkiqod8k000401ph6ikk4zwq/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoiam9oYW5udDk4IiwiYSI6ImNsa2lvbjh0MDBwNGczY2tnY3B3Y2F1ZWoifQ.X2SJBqmNTXyZAt2GaJckCA', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      tileSize: 512,
      zoomOffset: -1,
      accessToken: 'token'
    }).addTo(this.map);

    const ham = [9.991111, 53.630278];  // Note: [lng, lat] format is used
    const sti = [-70.604722, 19.406111];  // Note: [lng, lat] format is used
    const azs = [-69.7375, 19.27];
    const lax = [-118.408056, 33.9425];
    const oka = [127.645833, 26.195833];
    const nrt = [140.386389, 35.764722];
    const muc = [11.786086, 48.353783];
    const fra = [8.570456, 50.033306];
    const atl = [-84.428056, 33.636667];
    const jfk = [-73.778925, 40.63975];
    const dbx = [55.364444, 25.252778];
    const bkk = [100.747283, 13.681108];
    const tlx = ham;
    const pha = ham;

    this.drawOnMap(ham, sti, '#396297');
    this.drawOnMap(sti, azs, '#396297');
    this.drawOnMap(azs, lax, '#396297');
    this.drawOnMap(lax, oka, '#396297');
    this.drawOnMap(oka, nrt, '#396297');
    this.drawOnMap(nrt, muc, '#396297');
    this.drawOnMap(muc, ham, '#396297');
    this.drawOnMap(ham, fra, '#396297');
    this.drawOnMap(fra, atl, '#396297');
    this.drawOnMap(atl, jfk, '#396297');
    this.drawOnMap(jfk, fra, '#396297');
    this.drawOnMap(fra, dbx, '#396297');
    this.drawOnMap(dbx, fra, '#396297');
    this.drawOnMap(fra, bkk, '#396297');
    this.drawOnMap(bkk, fra, '#396297');
    this.drawOnMap(fra, ham, '#396297');
    this.drawOnMap(ham, tlx, '#396297');
    this.drawOnMap(tlx, pha, '#ee9a3a');
  }

  private drawOnMap(p1: number[], p2: number[], color: string): void {
    const p1_p2 = greatCircle(p1, p2, {properties: {stroke: color}});
    L.geoJSON(p1_p2, {
      style: function() {
        return { color: color };
      }
    }).addTo(this.map);
  }

  @ViewChild('map', { static: false }) mapContainer!: ElementRef;

  ngAfterViewInit(): void {
    this.setMapAspectRatio(16 / 32);  // Sets aspect ratio to 16:9
    this.initializeMap();
    this.saveScreenshot();
  }

  private setMapAspectRatio(aspectRatio: number): void {
    const mapContainerEl: HTMLElement = this.mapContainer.nativeElement;
    mapContainerEl.style.height = `${mapContainerEl.offsetWidth / aspectRatio}px`;
  }

  async saveScreenshot() {
    const mapElement = document.getElementById('map');  // Get the map DOM element
    if (mapElement) {
      const canvas = await html2canvas(mapElement);  // Convert the map to a canvas
      const imgData = canvas.toDataURL();  // Convert the canvas to an image data URL
      // Do something with imgData...
      // For instance, download the image:
      const link = document.createElement('a');
      link.href = imgData;
      link.download = 'map.png';
      link.click();
    }
  }
}
