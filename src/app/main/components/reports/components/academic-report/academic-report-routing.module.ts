import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AcademicReportComponent } from './academic-report.component';

import { DashboardComponent } from './components/acad-gc/dashboard.component';
import { CcsComponent } from './components/acad-ccs/ccs.component';
import { CeasDashboardComponent } from './components/acad-ceas/ceas-dashboard.component';
import { CbaDashboardComponent } from './components/acad-cba/cba-dashboard.component';
import { ChtmDashboardComponent } from './components/acad-chtm/chtm-dashboard.component';
import { CahsDashboardComponent } from './components/acad-cahs/cahs-dashboard.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard',
  component: DashboardComponent, 
  // children: [{
  //   path:'',
  //   loadChildren: ()=>import('../academic-report/components/acad-gc/dashboard/dashboard.module').then((m)=>m.DashboardModule)
  // }]
}, 
  { path: 'ccs-dashboard', 
    component: CcsComponent, 
    // children: [{
    //   path:'', 
    //   loadChildren: ()=>import('../academic-report/components/acad-ccs/ccs-dashboard/ccs-dashboard.module').then((m)=>m.CcsDashboardModule)
    // }]
},
  { path: 'ceas-dashboard', 
    component: CeasDashboardComponent, 
    // children: [{
    //   path:'', 
    //   loadChildren: ()=>import('../academic-report/components/acad-ceas/ceas-dashboard/ceas-dashboard.module').then((m)=>m.CeasDashboardModule)
    // }]
},
  { path: 'cba-dashboard', 
    component: CbaDashboardComponent, 
    // children: [{
    //   path: '', 
    //   loadChildren: ()=>import('../academic-report/components/acad-cba/cba-dashboard/cba-dashboard.module').then((m)=>m.CbaDashboardModule)
    // }]
},
  { path: 'chtm-dashboard', 
    component: ChtmDashboardComponent, 
    // children: [{
    //   path: '', 
    //   loadChildren: ()=>import('../academic-report/components/acad-chtm/chtm-dashboard/chtm-dashboard.module').then((m)=>m.ChtmDashboardModule)
    // }]
},
  { path: 'cahs-dashboard', 
    component: CahsDashboardComponent, 
    // children: [{
    //   path: '', 
    //   loadChildren: ()=>import('../academic-report/components/acad-cahs/cahs-dashboard/cahs-dashboard.module').then((m)=>m.CahsDashboardModule)
    // }]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AcademicReportRoutingModule { }
