import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { BooksComponent } from './components/books/books.component';
import { JournalsComponent } from './components/journals/journals.component';
import { MagazinesComponent } from './components/magazines/magazines.component';
import { ArticlesComponent } from './components/articles/articles.component';
import { NewspapersComponent } from './components/newspapers/newspapers.component';

import { MatTableModule } from '@angular/material/table';



@NgModule({
  declarations: [
    // JournalsComponent,
    // MagazinesComponent,
    // ArticlesComponent,
    // NewspapersComponent, 
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule, 
    MatTableModule, 
  ]
})
export class ReportsModule { }
