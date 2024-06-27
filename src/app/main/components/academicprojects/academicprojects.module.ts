import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AcademicprojectsRoutingModule } from './academicprojects-routing.module';

import { ListofprojectsComponent } from './components/listofprojects/listofprojects.component';
import { AddprojectComponent } from './components/addproject/addproject.component';

// POP UPS
import { EditdetailsComponent } from './components/editdetails/editdetails.component';
import { DetailsPopupComponent } from './components/details-popup/details-popup.component';
import { ImportProjectsComponent } from './components/import-projects/import-projects.component';

// ANGULAR MAT
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatHint } from '@angular/material/form-field';
import { ImageCropperComponent } from 'ngx-image-cropper';

@NgModule({
  declarations: [
    AddprojectComponent,
    EditdetailsComponent,
    DetailsPopupComponent,
    ImportProjectsComponent,
  ],
  imports: [
    CommonModule,
    AcademicprojectsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatHint,
    ImageCropperComponent
  ]
})
export class AcademicprojectsModule { }
