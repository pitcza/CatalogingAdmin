import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MainRoutingModule } from './main-routing.module';

import { AddmaterialsComponent } from './components/addmaterials/addmaterials.component';

import { AcademicprojectsComponent } from './components/academicprojects/academicprojects.component';
import { AcademicprojectsModule } from './components/academicprojects/academicprojects.module';

import { ListofmaterialsComponent } from './components/listofmaterials/listofmaterials.component';
import { ListofmaterialsModule } from './components/listofmaterials/listofmaterials.module';

import { ReportsComponent } from './components/reports/reports.component';
import { ReportsModule } from './components/reports/reports.module';
import { MaterialModule } from '../modules/material/material.module';

import { LoadingComponent } from './components/loading/loading.component';

@NgModule({
  declarations: [
    AddmaterialsComponent,
    AcademicprojectsComponent,
    ListofmaterialsComponent,
    ReportsComponent,
    LoadingComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    AcademicprojectsModule,
    ListofmaterialsModule,
    ReportsModule,
    FormsModule,
    RouterModule,
    MaterialModule
  ],
  exports: [
    LoadingComponent
  ]
})
export class MainModule { }
