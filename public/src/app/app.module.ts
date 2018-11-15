import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HttpService } from "./http.service";
import { HttpModule } from '@angular/http';

import { HttpClientModule } from "@angular/common/http";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, HttpModule],
  providers: [HttpService],
  bootstrap: [AppComponent]
})
export class AppModule { }
