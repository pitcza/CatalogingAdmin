import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArticlesRoutingModule } from './articles-routing.module';

import { MaterialModule } from '../../../../../modules/material/material.module';
import { ImageCropperComponent } from 'ngx-image-cropper';
import { RouterModule } from '@angular/router';
import { JournalsComponent } from './components/journals/journals.component';
import { MagazinesComponent } from './components/magazines/magazines.component';
import { NewspapersComponent } from './components/newspapers/newspapers.component';
import { DetailsComponent } from './components/details/details.component';


@NgModule({
  declarations: [
    JournalsComponent,
    MagazinesComponent,
    NewspapersComponent,
    DetailsComponent
  ],
  imports: [
    CommonModule,
    ArticlesRoutingModule,
    MaterialModule,
    ImageCropperComponent,
    RouterModule,
  ]
})
export class ArticlesModule { }
