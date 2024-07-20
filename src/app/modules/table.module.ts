import { NgModule } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

const MatModules = [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatCardModule,
    RouterLink
];

@NgModule({
  declarations: [],
  imports: [MatModules],
  exports: [MatModules]
})
export class TableModule {}
