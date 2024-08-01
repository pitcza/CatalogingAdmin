import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ListofmaterialsRoutingModule } from './listofmaterials-routing.module';

import { BooksComponent } from './components/books/books.component';
import { AudioVisualComponent } from './components/audio-visual/audio-visual.component';

// PERIODICALS TAB COMPONENTS AND MODULE
import { PeriodicalComponent } from './components/periodical/periodical.component';
import { PeriodicalModule } from './components/periodical/periodical.module';

// ARTICLES TAB COMPONENTS AND MODULE
import { ArticleComponent } from './components/article/article.component';
import { ArticleModule } from './components/article/article.module';

import { ImageCropperComponent } from 'ngx-image-cropper';
import { EditBookComponent } from './components/books/edit-book/edit-book.component';
import { EditAVComponent } from './components/audio-visual/edit-av/edit-av.component';

@NgModule({
  declarations: [
    PeriodicalComponent,
    ArticleComponent,
    EditBookComponent,
    EditAVComponent
  ],
  imports: [
    CommonModule,
    ListofmaterialsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PeriodicalModule,
    ArticleModule,
    ImageCropperComponent,
  ]
})
export class ListofmaterialsModule { }
