import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PeriodicalRoutingModule } from './periodical-routing.module';

import { JournalsComponent } from './components/journals/journals.component';
import { MagazinesComponent } from './components/magazines/magazines.component';
import { NewspapersComponent } from './components/newspapers/newspapers.component';
import { PerioDetailsComponent } from './components/perio-details/perio-details.component';
import { EditPeriodicalComponent } from './components/edit-periodical/edit-periodical.component';
import { PeriodicalComponent } from './periodical.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MaterialModule } from '../../../../../modules/material/material.module';

@NgModule({
  declarations: [
    PerioDetailsComponent,
    EditPeriodicalComponent,
    MagazinesComponent,
    JournalsComponent,
    NewspapersComponent
  ],
  imports: [
    PeriodicalRoutingModule,
    MaterialModule
  ]
})
export class PeriodicalModule { }
