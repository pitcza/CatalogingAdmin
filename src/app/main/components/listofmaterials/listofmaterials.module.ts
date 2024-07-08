import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ListofmaterialsRoutingModule } from './listofmaterials-routing.module';

import { BooksComponent } from './components/books/books.component';

// PERIODICALS TAB COMPONENTS AND MODULE
import { PeriodicalComponent } from './components/periodical/periodical.component';
import { PeriodicalModule } from './components/periodical/periodical.module';

// ARTICLES TAB COMPONENTS AND MODULE
import { ArticleComponent } from './components/article/article.component';
import { ArticleModule } from './components/article/article.module';

import { AudioVisualComponent } from './components/audio-visual/audio-visual.component';

@NgModule({
  declarations: [
    PeriodicalComponent,
    ArticleComponent,
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
