import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AcademicReportRoutingModule } from './academic-report-routing.module';
import { AcademicReportComponent } from './academic-report.component';
import { ChtmDashboardComponent } from './components/acad-chtm/chtm-dashboard.component';
import { CahsDashboardComponent } from './components/acad-cahs/cahs-dashboard.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatSortModule } from '@angular/material/sort';
import { DashboardComponent } from './components/acad-gc/dashboard.component';


@NgModule({
  declarations: [
    AcademicReportComponent,
  ],
  imports: [
    CommonModule,
    AcademicReportRoutingModule,
    MatPaginator,
    MatTableModule,
    MatCardModule,
    MatSortModule
  ]
})
export class AcademicReportModule { }
