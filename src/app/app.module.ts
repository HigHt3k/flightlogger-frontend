import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from "./app-routing.module";

import { AppComponent } from './app.component';
import { IndexComponent } from './index/index.component';
import { MapComponent } from './map/map.component';
import {LeafletModule} from "@asymmetrik/ngx-leaflet";
import {HttpClientModule} from "@angular/common/http";

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    MapComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        LeafletModule,
        HttpClientModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
