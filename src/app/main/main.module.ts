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

import { ReportsModule } from './components/reports/reports.module';
import { MaterialModule } from '../modules/material/material.module';

import { LoadingComponent } from './components/loading/loading.component';
import { ImageCropperComponent } from 'ngx-image-cropper';
import { ArchiveComponent } from './components/archive/archive.component';
import { ArchiveModule } from './components/archive/archive.module';
import { ReportsComponent } from './components/reports/reports.component';

@NgModule({
  declarations: [
    AddmaterialsComponent,
    AcademicprojectsComponent,
    ListofmaterialsComponent,
    // ReportsComponent,
    ArchiveComponent,
    LoadingComponent,
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    AcademicprojectsModule,
    ListofmaterialsModule,
    ReportsModule,
    ArchiveModule,
    FormsModule,
    RouterModule,
    MaterialModule,
    ImageCropperComponent
  ],
  exports: [
    MaterialModule,
    LoadingComponent
  ]
})
export class MainModule { }
