import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CahsDashboardRoutingModule } from './cahs-dashboard-routing.module';
import { CahsDashboardComponent } from './cahs-dashboard.component';


@NgModule({
  declarations: [
    CahsDashboardComponent
  ],
  imports: [
    CommonModule,
    CahsDashboardRoutingModule
  ]
})
export class CahsDashboardModule { }
