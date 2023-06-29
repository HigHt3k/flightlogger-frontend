import {Component, OnInit} from '@angular/core';
import * as L from 'leaflet';
import {HttpClient} from "@angular/common/http";
import chroma from "chroma-js";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    // ip and port for raspberry
    const serverIp: String = "192.168.178.30";
    const serverPort: String = "9090";

    const map = L.map('map').setView([53.673500, 9.985630], 7.5);

    const altitudeColors = chroma.scale(['green', 'yellow', 'orange', 'red', 'purple']).domain([0, 10000, 20000, 30000, 45000]);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    L.circle([53.673500, 9.985630], {
      color: 'blue',
      fillColor: 'blue',
      fillOpacity: 0.5,
      radius: 500
    }).addTo(map);

    this.http.get(`http://${serverIp}:${serverPort}/map?startDateTime=2023-06-29T00:00:00&endDateTime=2023-06-29T23:59:59`).subscribe((data: any) => {
      // Handle the flight data here
      console.log(data);

      data.forEach((flightLog: any) => {
        const callsign = flightLog.callsign;
        const acReg = flightLog.aircraft.aircraftRegistration;
        const acType = flightLog.aircraft.aircraftType;

        // basic line drawing, using the old data model
        /*const p1 = L.latLng(flightLog.firstLatitude, flightLog.firstLongitude);
        const p2 = L.latLng(flightLog.lastLatitude, flightLog.lastLongitude);

        const line = L.polyline([p1, p2], { color : 'blue' }).addTo(map);
        */
        // more complex flight path drawing using new data model
        const flightPaths = flightLog.flightPaths;
        flightPaths.forEach((flightPath: any, index: any) => {
          if(index != 0) {
            const p1 = L.latLng(flightPaths[index-1].latitude, flightPaths[index-1].longitude);
            const p2 = L.latLng(flightPaths[index].latitude, flightPaths[index].longitude);
            const altitude = (flightPaths[index-1].altitude + flightPaths[index].altitude)/2;
            const color = altitude !== null ? altitudeColors(altitude).hex() : '#000000';
            const tooltipContent = "altitude: " + altitude + "<br>" + "callsign: " + callsign + "<br>" + "acReg: " + acReg + "<br>" + "acType: " + acType;
            const line = L.polyline([p1, p2], { color : color }).bindTooltip(tooltipContent).addTo(map);
          }
        });
      });
    });
  }
}
