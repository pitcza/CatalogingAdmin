import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AcademicprojectsRoutingModule } from './academicprojects-routing.module';

import { ListofprojectsComponent } from './components/listofprojects/listofprojects.component';
import { AddprojectComponent } from './components/addproject/addproject.component';

// POP UPS
import { EditdetailsComponent } from './components/details-popup/editdetails/editdetails.component';
import { DetailsPopupComponent } from './components/details-popup/details-popup.component';

import { MatIcon, MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatHint } from '@angular/material/form-field';

@NgModule({
  declarations: [
    AddprojectComponent,
    EditdetailsComponent,
    DetailsPopupComponent
  ],
  imports: [
    CommonModule,
    AcademicprojectsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatHint
  ]
})
export class AcademicprojectsModule { }
