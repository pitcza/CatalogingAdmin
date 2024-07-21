import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';

import { MatTableModule } from '@angular/material/table';
import { BooksComponent } from './components/material-report/components/books/books.component';
import { ArticlesComponent } from './components/material-report/components/articles/articles.component';
import { JournalsComponent } from './components/material-report/components/journals/journals.component';
import { MagazinesComponent } from './components/material-report/components/magazines/magazines.component';
import { NewspapersComponent } from './components/material-report/components/newspapers/newspapers.component';


import { AcademicReportComponent } from './components/academic-report/academic-report.component';
import { MaterialReportComponent } from './components/material-report/material-report.component';
import { AcademicReportModule } from './components/academic-report/academic-report.module';
import { DashboardComponent } from './components/academic-report/components/acad-gc/dashboard.component';
// import { BooksComponent } from '../listofmaterials/components/books/books.component';

@NgModule({
  declarations: [
    
  ],

  imports: [
    CommonModule,
    ReportsRoutingModule, 
    MatTableModule
  ]
})
export class ReportsModule { }

