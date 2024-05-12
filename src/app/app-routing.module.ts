import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './main/main.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { 
    path: 'main', 
    component: MainComponent,
    children: [{
      path: '',
      loadChildren: ()=>import('./main/main.module').then((m)=>m.MainModule)
    }]
  },
  { path: 'material-report', loadChildren: () => import('./main/components/reports/components/material-report/material-report.module').then(m => m.MaterialReportModule) },
  { path: 'academic-report', loadChildren: () => import('./main/components/reports/components/academic-report/academic-report.module').then(m => m.AcademicReportModule) },
  { path: 'dashboard', loadChildren: () => import('./main/components/reports/components/academic-report/components/acad-gc/dashboard/dashboard.module').then(m => m.DashboardModule) },
  { path: 'ccs-dashboard', loadChildren: () => import('./main/components/reports/components/academic-report/components/acad-ccs/ccs-dashboard/ccs-dashboard.module').then(m => m.CcsDashboardModule) },
  { path: 'ceas-dashboard', loadChildren: () => import('./main/components/reports/components/academic-report/components/acad-ceas/ceas-dashboard/ceas-dashboard.module').then(m => m.CeasDashboardModule) },
  { path: 'cba-dashboard', loadChildren: () => import('./main/components/reports/components/academic-report/components/acad-cba/cba-dashboard/cba-dashboard.module').then(m => m.CbaDashboardModule) },
  { path: 'chtm-dashboard', loadChildren: () => import('./main/components/reports/components/academic-report/components/acad-chtm/chtm-dashboard/chtm-dashboard.module').then(m => m.ChtmDashboardModule) },
  { path: 'cahs-dashboard', loadChildren: () => import('./main/components/reports/components/academic-report/components/acad-cahs/cahs-dashboard/cahs-dashboard.module').then(m => m.CahsDashboardModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
