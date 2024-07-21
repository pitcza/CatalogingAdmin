import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MaterialReportComponent } from './components/material-report/material-report.component';
import { BooksComponent } from './components/material-report/components/books/books.component';
import { ArticlesComponent } from './components/material-report/components/articles/articles.component';
import { JournalsComponent } from './components/material-report/components/journals/journals.component';
import { MagazinesComponent } from './components/material-report/components/magazines/magazines.component';
import { NewspapersComponent } from './components/material-report/components/newspapers/newspapers.component';
import { AudiovisualsComponent } from './components/material-report/components/audiovisuals/audiovisuals.component';
import { DashboardComponent } from './components/academic-report/components/acad-gc/dashboard.component';
import { AcademicReportComponent } from './components/academic-report/academic-report.component';


const routes: Routes = [
  { path: '', redirectTo: 'material-report', pathMatch: 'full' },
  { path: 'material-report', 
  component: MaterialReportComponent, 
  children: [{
    path:'', 
    loadChildren: ()=>import('../reports/components/material-report/material-report.module').then((m)=>m.MaterialReportModule)
  }]
},
  { path: 'academic-report',
  component: AcademicReportComponent, 
  children: [{
    path:'', 
    loadChildren: ()=>import('../reports/components/academic-report/academic-report.module').then((m)=>m.AcademicReportModule)
  }]
}, 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
