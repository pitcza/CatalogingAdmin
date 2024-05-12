import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CahsDashboardComponent } from './cahs-dashboard.component';

import { CahsComponent } from '../cahs/cahs.component';

const routes: Routes = [
  { path: '', redirectTo: 'cahs', pathMatch: 'full'},
  { path: 'cahs', component: CahsComponent} 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CahsDashboardRoutingModule { }
