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
import { PeriodicalsModule } from './components/periodicals/periodicals.module';
import { ArticlesModule } from './components/articles/articles.module';
import { DetailsComponent as ProjectDetailsComponent} from './components/academicprojects/details/details.component';
import { DetailsComponent as BookDetailsComponent } from './components/books/details/details.component';
import { DetailsComponent as AudioVisualDetailsComponent } from './components/audio-visuals/details/details.component';

@NgModule({
  declarations: [
    PeriodicalsComponent,
    ArticlesComponent,
    AudioVisualsComponent,
    AcademicprojectsComponent,
    ProjectDetailsComponent,
    BookDetailsComponent,
    AudioVisualDetailsComponent
  ],
  imports: [
    CommonModule,
    ArchiveRoutingModule,
    PeriodicalsModule,
    ArticlesModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ]
})
export class ArchiveModule { }
