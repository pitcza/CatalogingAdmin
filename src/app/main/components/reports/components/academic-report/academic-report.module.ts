import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AcademicReportRoutingModule } from './academic-report-routing.module';
import { AcademicReportComponent } from './academic-report.component';
import { GcComponent } from './components/acad-gc/gc/gc.component';




@NgModule({
  declarations: [
    AcademicReportComponent,
  ],
  imports: [
    CommonModule,
    AcademicReportRoutingModule
  ]
})
export class AcademicReportModule { }
