import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListofmaterialsRoutingModule } from './listofmaterials-routing.module';

import { BooksComponent } from './components/books/books.component';
import { PeriodicalsComponent } from './components/periodicals/periodicals.component';
import { ArticlesComponent } from './components/articles/articles.component';

import { EditBookComponent } from './components/edit-book/edit-book.component';
import { EditPeriodicalComponent } from './components/edit-periodical/edit-periodical.component';
import { EditArticleComponent } from './components/edit-article/edit-article.component';
import { BookDetailsPopupComponent } from './components/book-details-popup/book-details-popup.component';
import { PeriodicalDetailsPopupComponent } from './components/periodical-details-popup/periodical-details-popup.component';
import { ArticleDetailsPopupComponent } from './components/article-details-popup/article-details-popup.component';
import { DeletematPopupComponent } from './components/deletemat-popup/deletemat-popup.component';

@NgModule({
  declarations: [
    EditBookComponent,
    EditPeriodicalComponent,
    EditArticleComponent,
    BookDetailsPopupComponent,
    PeriodicalDetailsPopupComponent,
    ArticleDetailsPopupComponent,
    DeletematPopupComponent
  ],
  imports: [
    CommonModule,
    ListofmaterialsRoutingModule,
  ]
})
export class ListofmaterialsModule { }
