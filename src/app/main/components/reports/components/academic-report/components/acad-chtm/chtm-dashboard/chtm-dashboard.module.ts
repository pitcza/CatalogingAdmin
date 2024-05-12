import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChtmDashboardRoutingModule } from './chtm-dashboard-routing.module';
import { ChtmDashboardComponent } from './chtm-dashboard.component';


@NgModule({
  declarations: [
    ChtmDashboardComponent
  ],
  imports: [
    CommonModule,
    ChtmDashboardRoutingModule
  ]
})
export class ChtmDashboardModule { }
