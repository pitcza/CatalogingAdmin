import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArticlesRoutingModule } from './articles-routing.module';


import { MaterialModule } from '../../../../../modules/material/material.module';
import { ImageCropperComponent } from 'ngx-image-cropper';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ArticlesRoutingModule,
    MaterialModule,
    ImageCropperComponent,
    RouterModule,
  ]
})
export class ArticlesModule { }
