import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MapComponent } from "./map/map.component";
import {IndexComponent} from "./index/index.component";
import {FleetmapComponent} from "./fleetmap/fleetmap.component";

const routes: Routes = [
  {
    path: 'map', component: MapComponent
  },
  {
    path: '', component: IndexComponent
  },
  {
    path: 'fleetmap', component: FleetmapComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
