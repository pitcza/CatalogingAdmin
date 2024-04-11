import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListofmaterialsRoutingModule } from './listofmaterials-routing.module';
import { BooksComponent } from './components/books/books.component';
import { PeriodicalsComponent } from './components/periodicals/periodicals.component';
import { ArticlesComponent } from './components/articles/articles.component';

@NgModule({
  declarations: [
    BooksComponent,
    PeriodicalsComponent,
    ArticlesComponent
  ],
  imports: [
    CommonModule,
    ListofmaterialsRoutingModule
  ]
})
export class ListofmaterialsModule { }
