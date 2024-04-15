import { Component , OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-deletemat-popup',
  templateUrl: './deletemat-popup.component.html',
  styleUrl: './deletemat-popup.component.scss'
})
export class DeletematPopupComponent implements OnInit{
  ngOnInit(): void {
  }

  constructor(private ref: MatDialogRef<DeletematPopupComponent>, private buildr: FormBuilder,) {
  }

  closepopup() {
    this.ref.close('Closed using function');
  }
}
