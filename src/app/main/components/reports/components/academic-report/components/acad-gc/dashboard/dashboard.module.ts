import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';

import { CcsComponent } from '../../acad-ccs/ccs/ccs.component';

import { CeasComponent } from '../../acad-ceas/ceas/ceas.component';
import { CbaComponent } from '../../acad-cba/cba/cba.component';
import { ChtmComponent } from '../../acad-chtm/chtm/chtm.component';
import { CahsComponent } from '../../acad-cahs/cahs/cahs.component';


@NgModule({
  declarations: [
    DashboardComponent, 
  ],
  
  imports: [
    CommonModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
