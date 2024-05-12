import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChtmDashboardComponent } from './chtm-dashboard.component';

import { CbaComponent } from '../../acad-cba/cba/cba.component';

const routes: Routes = [
  { path: '', redirectTo: 'chtm', pathMatch: 'full'}, 
  { path: 'chtm', component: CbaComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChtmDashboardRoutingModule { }
