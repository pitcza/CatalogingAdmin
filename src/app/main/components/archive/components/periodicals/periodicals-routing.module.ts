import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JournalsComponent } from './components/journals/journals.component';
import { MagazinesComponent } from './components/magazines/magazines.component';
import { NewspapersComponent } from './components/newspapers/newspapers.component';

const routes: Routes = [

  { path: '', redirectTo: 'journals', pathMatch: 'full' },
  { path: 'journals', component: JournalsComponent},
  { path: 'magazines', component: MagazinesComponent},
  { path: 'newspapers', component: NewspapersComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PeriodicalsRoutingModule { }
