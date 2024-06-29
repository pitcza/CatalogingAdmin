import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArticleRoutingModule } from './article-routing.module';

import { JournalsComponent } from './components/journals/journals.component';
import { MagazinesComponent } from './components/magazines/magazines.component';
import { NewspapersComponent } from './components/newspapers/newspapers.component';

import { EditArticleComponent } from './components/edit-article/edit-article.component';
import { ArticleDetailsComponent } from './components/article-details/article-details.component';
import { MaterialModule } from '../../../../../modules/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ArticleDetailsComponent,
    EditArticleComponent,
    // JournalsComponent,
    // MagazinesComponent,
    // NewspapersComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    // MaterialModule,
    ArticleRoutingModule
  ]
})
export class ArticleModule { }
