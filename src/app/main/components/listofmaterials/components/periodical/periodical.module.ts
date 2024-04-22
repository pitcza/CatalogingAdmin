import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PeriodicalRoutingModule } from './periodical-routing.module';

import { JournalsComponent } from './components/journals/journals.component';
import { MagazinesComponent } from './components/magazines/magazines.component';
import { NewspapersComponent } from './components/newspapers/newspapers.component';
import { PerioDetailsComponent } from './components/perio-details/perio-details.component';
import { EditPeriodicalComponent } from './components/edit-periodical/edit-periodical.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    PerioDetailsComponent,
    EditPeriodicalComponent
  ],
  imports: [
    CommonModule,
    PeriodicalRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class PeriodicalModule { }
