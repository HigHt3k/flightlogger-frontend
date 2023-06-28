import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
    const map = L.map('map').setView([53.673500, 9.985630], 1);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    L.circle([53.673500, 9.985630], {
      color: 'blue',
      fillColor: 'blue',
      fillOpacity: 0.5,
      radius: 500
    }).addTo(map);
  }
}
