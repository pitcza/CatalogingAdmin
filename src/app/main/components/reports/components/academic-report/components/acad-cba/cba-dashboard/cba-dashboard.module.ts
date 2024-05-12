import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CbaDashboardRoutingModule } from './cba-dashboard-routing.module';
import { CbaDashboardComponent } from './cba-dashboard.component';


@NgModule({
  declarations: [
    CbaDashboardComponent
  ],
  imports: [
    CommonModule,
    CbaDashboardRoutingModule
  ]
})
export class CbaDashboardModule { }
