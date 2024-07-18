import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BooksComponent } from './components/books/books.component';
import { PeriodicalsComponent } from './components/periodicals/periodicals.component';
import { ArticlesComponent } from './components/articles/articles.component';
import { AudioVisualsComponent } from './components/audio-visuals/audio-visuals.component';
import { AcademicprojectsComponent } from './components/academicprojects/academicprojects.component';

const routes: Routes = [
  { path: '', redirectTo: 'books', pathMatch: 'full' },
  { path: 'books', component: BooksComponent},
  { path: 'periodicals', 
    component: PeriodicalsComponent,
    children: [{
      path: '',
      loadChildren: ()=>import('../archive/components/periodicals/periodicals.module').then((m)=>m.PeriodicalsModule)
    }]
  },
  { path: 'articles', 
    component: ArticlesComponent,
    children: [{
      path: '',
      loadChildren: ()=>import('../archive/components/articles/articles.module').then((m)=>m.ArticlesModule)
    }]
  },
  { path: 'audio-visuals', component: AudioVisualsComponent},
  { path: 'academicprojects', component: AcademicprojectsComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArchiveRoutingModule { }
