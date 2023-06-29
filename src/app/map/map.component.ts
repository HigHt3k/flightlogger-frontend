import {Component, OnInit} from '@angular/core';
import * as L from 'leaflet';
import {HttpClient} from "@angular/common/http";
import chroma from "chroma-js";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  constructor(private http: HttpClient) { }

  serverIp: String = "192.168.178.30";
  serverPort: String = "9090";

  altitudeColors = chroma.scale(['green', 'yellow', 'orange', 'red', 'purple', 'black']).domain([0, 10000, 20000, 30000, 40000, 50000]);

  minAltitude: number = 0;
  maxAltitude: number = 50000;

  map!: L.Map;
  flightLines: any[] = [];
  flightLogs: any[] = [];

  ngOnInit(): void {
    this.initializeMap();
  }

  changeAltitude(minAltitude: string, maxAltitude: string) {
    this.minAltitude = Number(minAltitude);
    this.maxAltitude = Number(maxAltitude);
    this.updateFlightLineVisibility();
  }


  private initializeMap(): void {
    this.map = L.map('map').setView([53.673500, 9.985630], 7.5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    L.circle([53.673500, 9.985630], {
      color: 'blue',
      fillColor: 'blue',
      fillOpacity: 0.5,
      radius: 500
    }).addTo(this.map);

    this.fetchFlightLogs();
  }

  clearFlightLines(): void {
    this.flightLines.forEach((line: L.Polyline) => {
      line.removeFrom(this.map);
    });
    this.flightLines = [];
  }

  fetchFlightLogs(): void {
    this.http
      .get(`http://${this.serverIp}:${this.serverPort}/map?startDateTime=2023-06-29T12:00:00&endDateTime=2023-06-29T23:59:59`)
      .subscribe((data: any) => {
        this.flightLogs = data;
        this.drawFlightLines();
      });
  }

  drawFlightLines(): void {
    this.clearFlightLines();
    this.flightLogs.forEach((flightLog: any) => {
      const callsign = flightLog.callsign;
      const acReg = flightLog.aircraft.aircraftRegistration;
      const acType = flightLog.aircraft.aircraftType;

      // more complex flight path drawing using new data model
      const flightPaths = flightLog.flightPaths;
      flightPaths.forEach((flightPath: any, index: any) => {
        if(index != 0) {
          const p1 = L.latLng(flightPaths[index-1].latitude, flightPaths[index-1].longitude);
          const p2 = L.latLng(flightPaths[index].latitude, flightPaths[index].longitude);
          const altitude = (flightPaths[index-1].altitude + flightPaths[index].altitude)/2;
          const color = this.altitudeColors(altitude).hex();
          const tooltipContent = "altitude: " + altitude + "<br>" + "callsign: " + callsign + "<br>" + "acReg: " + acReg + "<br>" + "acType: " + acType;
          const line = L.polyline([p1, p2], { color : color }).bindTooltip(tooltipContent).addTo(this.map);
          const obj = [altitude, line];
          this.flightLines.push(obj);
        }
      });
    });
  }

  updateFlightLineVisibility(): void {
    this.flightLines.forEach((obj: any) => {
      const altitude: number = obj[0];
      const line: L.Polyline = obj[1];
      if(altitude >= this.minAltitude && altitude <= this.maxAltitude) {
        line.setStyle({opacity: 1});
      } else {
        line.setStyle({opacity: 0});
      }
    });
  }
}
