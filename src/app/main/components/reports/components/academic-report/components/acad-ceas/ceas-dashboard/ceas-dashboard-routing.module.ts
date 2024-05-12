import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CeasDashboardComponent } from './ceas-dashboard.component';

import { CeasComponent } from '../../acad-ceas/ceas/ceas.component';

const routes: Routes = [
  { path: '', redirectTo: 'ceas', pathMatch: 'full' }, 
  { path: 'ceas', component: CeasComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CeasDashboardRoutingModule { }
