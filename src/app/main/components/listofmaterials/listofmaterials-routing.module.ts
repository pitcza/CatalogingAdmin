import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BooksComponent } from './components/books/books.component';
import { PeriodicalComponent } from './components/periodical/periodical.component';
import { ArticleComponent } from './components/article/article.component';

const routes: Routes = [
  { path: '', redirectTo: 'books', pathMatch: 'full' },
  { path: 'books', component: BooksComponent},
  { path: 'periodical', 
    component: PeriodicalComponent,
    children: [{
      path: '',
      loadChildren: ()=>import('../listofmaterials/components/periodical/periodical.module').then((m)=>m.PeriodicalModule)
    }]
  },
  { path: 'article', 
    component: ArticleComponent,
    children: [{
      path: '',
      loadChildren: ()=>import('../listofmaterials/components/article/article.module').then((m)=>m.ArticleModule)
    }]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListofmaterialsRoutingModule { }
