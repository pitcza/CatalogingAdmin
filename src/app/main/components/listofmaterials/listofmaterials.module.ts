import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ListofmaterialsRoutingModule } from './listofmaterials-routing.module';

// BOOKS TAB COMPONENTS
import { BooksComponent } from './components/books/books.component';
import { BookDetailsPopupComponent } from './components/book-details-popup/book-details-popup.component';

// PERIODICALS TAB COMPONENTS AND MODULE
import { PeriodicalComponent } from './components/periodical/periodical.component';
import { PeriodicalModule } from './components/periodical/periodical.module';

// ARTICLES TAB COMPONENTS AND MODULE
import { ArticleComponent } from './components/article/article.component';
import { ArticleModule } from './components/article/article.module';
import { EditBookComponent } from './components/edit-book/edit-book.component';

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
