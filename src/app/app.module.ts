import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {ButtonModule} from "primeng/button";
import {SharedModule} from "primeng/api";
import {TooltipModule} from "primeng/tooltip";
import {ToastModule} from "primeng/toast";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ImageModule} from "primeng/image";
import {ProgressBarModule} from "primeng/progressbar";
import {CurrencyPipe} from "@angular/common";
import {ConfirmPopupModule} from "primeng/confirmpopup";
import {TableModule} from "primeng/table";
import {DialogModule} from "primeng/dialog";
import {ChartModule} from "primeng/chart";
import {CardModule} from "primeng/card";

@NgModule({
  declarations: [
    AppComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        ButtonModule,
        SharedModule,
        TooltipModule,
        ToastModule,
        ImageModule,
        ProgressBarModule,
        ConfirmPopupModule,
        TableModule,
        DialogModule,
        ChartModule,
        CardModule,
    ],
  providers: [CurrencyPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
