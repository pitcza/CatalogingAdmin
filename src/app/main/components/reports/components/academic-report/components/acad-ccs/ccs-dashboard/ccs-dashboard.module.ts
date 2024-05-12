import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CcsDashboardRoutingModule } from './ccs-dashboard-routing.module';
import { CcsDashboardComponent } from './ccs-dashboard.component';


@NgModule({
  declarations: [
    CcsDashboardComponent
  ],
  imports: [
    CommonModule,
    CcsDashboardRoutingModule
  ]
})
export class CcsDashboardModule { }
