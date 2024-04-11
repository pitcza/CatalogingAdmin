import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ListofprojectsComponent } from './components/listofprojects/listofprojects.component';
import { AddprojectComponent } from './components/addproject/addproject.component';

const routes: Routes = [
  { path: '', redirectTo: 'listofprojects', pathMatch: 'full' },
  { path: 'listofprojects', component: ListofprojectsComponent},
  { path: 'addproject', component: AddprojectComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AcademicprojectsRoutingModule { }
