import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';

// Insert material imports here
const MatModules = [
  CommonModule,
  MatButtonModule,
  MatTableModule,
  MatIconModule,
  MatDividerModule,
  MatDialogModule
]

@NgModule({
  declarations: [],
  imports: [ MatModules ],
  exports: [ MatModules ]
})
export class MaterialModule { }
