import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-details-popup',
  templateUrl: './details-popup.component.html',
  styleUrl: './details-popup.component.scss'
})
export class DetailsPopupComponent implements OnInit{

  ngOnInit(): void {
  }

  constructor(private ref: MatDialogRef<DetailsPopupComponent>, private buildr: FormBuilder,) {
  }

  closepopup() {
    this.ref.close('Closed using function');
  }
}