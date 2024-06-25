import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-import-projects',
  templateUrl: './import-projects.component.html',
  styleUrl: './import-projects.component.scss'
})
export class ImportProjectsComponent {
  constructor(
    private ref: MatDialogRef<ImportProjectsComponent>, 
  ) { }

  closepopup() {
    this.ref.close('Closed using function');
  }

}
