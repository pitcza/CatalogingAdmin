import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CeasComponent } from '../../acad-ceas/ceas/ceas.component';
import { CbaComponent } from '../../acad-cba/cba/cba.component';
import { ChtmComponent } from '../../acad-chtm/chtm/chtm.component';
import { CahsComponent } from '../../acad-cahs/cahs/cahs.component';
import { GcComponent } from '../gc/gc.component';
import { CcsComponent } from '../../acad-ccs/ccs/ccs.component';
import { CcsDashboardComponent } from '../../acad-ccs/ccs-dashboard/ccs-dashboard.component';

const routes: Routes = [
  { path: '', redirectTo: 'gc', pathMatch: 'full' },
  { path: 'gc', component: GcComponent}, 
  { path: 'ccs', component: CcsComponent}, 
  { path: 'ceas', component: CeasComponent}, 
  { path: 'cba', component: CbaComponent}, 
  { path: 'chtm', component: ChtmComponent}, 
  { path: 'cahs', component: CahsComponent}, 

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
