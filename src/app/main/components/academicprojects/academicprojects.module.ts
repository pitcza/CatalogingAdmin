import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AcademicprojectsRoutingModule } from './academicprojects-routing.module';

import { ListofprojectsComponent } from './components/listofprojects/listofprojects.component';
import { AddprojectComponent } from './components/addproject/addproject.component';
import { EditdetailsComponent } from './components/editdetails/editdetails.component';

// POP UPS
import { CancelPopupComponent } from './components/cancel-popup/cancel-popup.component';
import { DeletePopupComponent } from './components/delete-popup/delete-popup.component';
import { DetailsPopupComponent } from './components/details-popup/details-popup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ListofprojectsComponent,
    AddprojectComponent,
    EditdetailsComponent,
    CancelPopupComponent,
    DeletePopupComponent,
    DetailsPopupComponent
  ],
  imports: [
    CommonModule,
    AcademicprojectsRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AcademicprojectsModule { }
