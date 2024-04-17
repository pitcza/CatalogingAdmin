import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AddmaterialsComponent } from './components/addmaterials/addmaterials.component';
import { AcademicprojectsComponent } from './components/academicprojects/academicprojects.component';
import { ListofmaterialsComponent } from './components/listofmaterials/listofmaterials.component';
import { ActivitylogComponent } from './components/activitylog/activitylog.component';

import { ReportsComponent } from './components/reports/reports.component';


const routes: Routes = [
  { path: '', redirectTo: 'addmaterials', pathMatch: 'full' },
  { path: 'addmaterials', component: AddmaterialsComponent},
  { 
    path: 'academicprojects', 
    component: AcademicprojectsComponent,
    children: [{
      path: '',
      loadChildren: ()=>import('./components/academicprojects/academicprojects.module').then((m)=>m.AcademicprojectsModule)
    }]
  },
  { 
    path: 'listofmaterials', 
    component: ListofmaterialsComponent,
    children: [{
      path: '',
      loadChildren: ()=>import('./components/listofmaterials/listofmaterials.module').then((m)=>m.ListofmaterialsModule)
    }]
  },
  { path: 'activitylog', component: ActivitylogComponent},
  { 
    path: 'reports', 
    component: ReportsComponent,
    children: [{
      path: '',
      loadChildren: ()=>import('./components/reports/reports.module').then((m)=>m.ReportsModule)
    }]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
