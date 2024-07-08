import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrl: './import.component.scss'
})
export class ImportComponent {
  constructor (
    private ref: MatDialogRef<ImportComponent>,
  ) { }

  closepopup() {
    this.ref.close('closed using function');
  }

}
