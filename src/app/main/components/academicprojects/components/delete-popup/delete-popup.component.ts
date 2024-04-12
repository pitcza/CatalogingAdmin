import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-popup',
  templateUrl: './delete-popup.component.html',
  styleUrl: './delete-popup.component.scss'
})
export class DeletePopupComponent implements OnInit{
  ngOnInit(): void {
  }

  constructor(private ref: MatDialogRef<DeletePopupComponent>, private buildr: FormBuilder,) {
  }

  closepopup() {
    this.ref.close('Closed using function');
  }
}