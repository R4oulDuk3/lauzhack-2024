import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BoberComponent } from './bober/bober.component';
import {HttpClientModule} from "@angular/common/http";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatIconModule} from "@angular/material/icon";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import { MatCardModule } from '@angular/material/card';
import {MatTableModule} from "@angular/material/table";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatSliderModule} from "@angular/material/slider";
import {FormsModule} from "@angular/forms";
import {ControlStateComponent} from "./bober/select/control-state/control-state.component";
import {MetricsComponent} from "./bober/select/metrics/metrics.component";
import {LoggingComponent} from "./bober/select/logging/logging.component";

@NgModule({
  declarations: [
    AppComponent,
    BoberComponent,
    ControlStateComponent,
    MetricsComponent,
    LoggingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatTableModule,
    MatSlideToggleModule,
    MatSliderModule,
    FormsModule,
    // Make sure this is here
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
