import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PeriodicalsRoutingModule } from './periodicals-routing.module';
import { JournalsComponent } from './components/journals/journals.component';
import { MagazinesComponent } from './components/magazines/magazines.component';
import { NewspapersComponent } from './components/newspapers/newspapers.component';

import { MaterialModule } from '../../../../../modules/material/material.module';
import { ImageCropperComponent } from 'ngx-image-cropper';
import { RouterModule } from '@angular/router';
import { DetailsComponent } from './components/details/details.component';

@NgModule({
  declarations: [

    MagazinesComponent,
    NewspapersComponent,
    DetailsComponent
  ],
  imports: [
    CommonModule,
    PeriodicalsRoutingModule,
    MaterialModule,
    ImageCropperComponent,
    RouterModule
  ]
})
export class PeriodicalsModule { }
