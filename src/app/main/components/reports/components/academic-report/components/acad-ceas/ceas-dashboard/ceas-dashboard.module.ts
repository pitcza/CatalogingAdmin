import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CeasDashboardRoutingModule } from './ceas-dashboard-routing.module';
import { CeasDashboardComponent } from './ceas-dashboard.component';


@NgModule({
  declarations: [
    CeasDashboardComponent
  ],
  imports: [
    CommonModule,
    CeasDashboardRoutingModule
  ]
})
export class CeasDashboardModule { }
