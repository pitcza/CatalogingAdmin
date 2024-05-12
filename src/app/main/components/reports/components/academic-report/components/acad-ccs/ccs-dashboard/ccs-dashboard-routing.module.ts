import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CcsDashboardComponent } from './ccs-dashboard.component';

import { CcsComponent } from '../../acad-ccs/ccs/ccs.component';


const routes: Routes = [
  { path: '', redirectTo: 'ccs', pathMatch: 'full' }, 
  { path: 'ccs', component: CcsComponent}, 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CcsDashboardRoutingModule { }
