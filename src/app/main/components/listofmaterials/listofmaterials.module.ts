import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListofmaterialsRoutingModule } from './listofmaterials-routing.module';
import { BooksComponent } from './components/books/books.component';
import { PeriodicalsComponent } from './components/periodicals/periodicals.component';
import { ArticlesComponent } from './components/articles/articles.component';
import { DeletePopupComponent } from './components/delete-popup/delete-popup.component';
import { EditdetailsComponent } from './components/editdetails/editdetails.component';
import { DetailsPopupComponent } from './components/details-popup/details-popup.component';

@NgModule({
  declarations: [
    PeriodicalsComponent,
    ArticlesComponent,
    DeletePopupComponent,
    EditdetailsComponent,
    DetailsPopupComponent
  ],
  imports: [
    CommonModule,
    ListofmaterialsRoutingModule,
  ]
})
export class ListofmaterialsModule { }
