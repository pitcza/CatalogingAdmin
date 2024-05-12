import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CbaDashboardComponent } from './cba-dashboard.component';

import { CbaComponent } from '../../acad-cba/cba/cba.component';


const routes: Routes = [
  { path: '', redirectTo: 'cba', pathMatch: 'full' }, 
  { path: 'cba', component: CbaComponent}, 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CbaDashboardRoutingModule { }
