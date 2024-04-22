import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ListofmaterialsRoutingModule } from './listofmaterials-routing.module';

import { BooksComponent } from './components/books/books.component';
import { EditBookComponent } from './components/edit-book/edit-book.component';
import { BookDetailsPopupComponent } from './components/book-details-popup/book-details-popup.component';

import { PeriodicalComponent } from './components/periodical/periodical.component';
import { PeriodicalModule } from './components/periodical/periodical.module';

import { ArticleComponent } from './components/article/article.component';
import { ArticleModule } from './components/article/article.module';

@NgModule({
  declarations: [
    EditBookComponent,
    BookDetailsPopupComponent,
    PeriodicalComponent,
    ArticleComponent
  ],
  imports: [
    CommonModule,
    ListofmaterialsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PeriodicalModule,
    ArticleModule
  ]
})
export class ListofmaterialsModule { }
