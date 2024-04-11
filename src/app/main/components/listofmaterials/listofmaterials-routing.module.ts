import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BooksComponent } from './components/books/books.component';
import { PeriodicalsComponent } from './components/periodicals/periodicals.component';
import { ArticlesComponent } from './components/articles/articles.component';

const routes: Routes = [
  { path: '', redirectTo: 'books', pathMatch: 'full' },
  { path: 'books', component: BooksComponent},
  { path: 'periodicals', component: PeriodicalsComponent},
  { path: 'articles', component: ArticlesComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListofmaterialsRoutingModule { }
