import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ArchiveRoutingModule } from './archive-routing.module';
import { BooksComponent } from './components/books/books.component';
import { PeriodicalsComponent } from './components/periodicals/periodicals.component';
import { MaterialModule } from '../../../modules/material/material.module';
import { ArticlesComponent } from './components/articles/articles.component';
import { AudioVisualsComponent } from './components/audio-visuals/audio-visuals.component';
import { AcademicprojectsComponent } from './components/academicprojects/academicprojects.component';

@NgModule({
  declarations: [
    PeriodicalsComponent,
    ArticlesComponent,
    AudioVisualsComponent,
    AcademicprojectsComponent,
  ],
  imports: [
    CommonModule,
    ArchiveRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ]
})
export class ArchiveModule { }
