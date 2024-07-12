import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AcademicprojectsRoutingModule } from './academicprojects-routing.module';

import { ListofprojectsComponent } from './components/listofprojects/listofprojects.component';
import { AddprojectComponent } from './components/addproject/addproject.component';

// POP UPS
import { EditdetailsComponent } from './components/editdetails/editdetails.component';
import { DetailsPopupComponent } from './components/details-popup/details-popup.component';

import { ImageCropperComponent } from 'ngx-image-cropper';

@NgModule({
  declarations: [
    AddprojectComponent,
    EditdetailsComponent,
    DetailsPopupComponent,
  ],
  imports: [
    CommonModule,
    AcademicprojectsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ImageCropperComponent,
  ]
})
export class AcademicprojectsModule { }
