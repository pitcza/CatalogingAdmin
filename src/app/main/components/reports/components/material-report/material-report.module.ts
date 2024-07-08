import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialReportRoutingModule } from './material-report-routing.module';
import { MaterialReportComponent } from './material-report.component';

import { BooksComponent } from './components/books/books.component';
import { JournalsComponent } from './components/journals/journals.component';
import { MagazinesComponent } from './components/magazines/magazines.component';
import { ArticlesComponent } from './components/articles/articles.component';
import { NewspapersComponent } from './components/newspapers/newspapers.component';
import { AudiovisualsComponent } from './components/audiovisuals/audiovisuals.component';


@NgModule({
  declarations: [
    MaterialReportComponent
  ],

  imports: [
    CommonModule,
    MaterialReportRoutingModule, 
    BooksComponent,
    JournalsComponent,
    MagazinesComponent,
    ArticlesComponent,
    NewspapersComponent, 
    AudiovisualsComponent
  ]
})
export class MaterialReportModule { }
