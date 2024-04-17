import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { AddmaterialsComponent } from './components/addmaterials/addmaterials.component';
import { AcademicprojectsComponent } from './components/academicprojects/academicprojects.component';
import { AcademicprojectsModule } from './components/academicprojects/academicprojects.module';
import { ListofmaterialsComponent } from './components/listofmaterials/listofmaterials.component';
import { ListofmaterialsModule } from './components/listofmaterials/listofmaterials.module';
import { ActivitylogComponent } from './components/activitylog/activitylog.component';

import { FormsModule } from '@angular/forms';

import { ReportsComponent } from './components/reports/reports.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    AddmaterialsComponent,
    AcademicprojectsComponent,
    ListofmaterialsComponent,
    ActivitylogComponent, 
    ReportsComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    AcademicprojectsModule,
    ListofmaterialsModule,
    FormsModule, 
    RouterModule
  ]
})
export class MainModule { }
