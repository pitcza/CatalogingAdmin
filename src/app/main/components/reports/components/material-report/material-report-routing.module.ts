import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BooksComponent } from './components/books/books.component';
import { ArticlesComponent } from './components/articles/articles.component';
import { JournalsComponent } from './components/journals/journals.component';
import { MagazinesComponent } from './components/magazines/magazines.component';
import { NewspapersComponent } from './components/newspapers/newspapers.component';


const routes: Routes = [
{ path: '', redirectTo: 'books', pathMatch: 'full' },
{ path: 'books', component: BooksComponent}, 
{ path: 'articles', component: ArticlesComponent},
{ path: 'journals', component: JournalsComponent}, 
{ path: 'magazines', component: MagazinesComponent}, 
{ path: 'newspapers', component: NewspapersComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaterialReportRoutingModule { }
