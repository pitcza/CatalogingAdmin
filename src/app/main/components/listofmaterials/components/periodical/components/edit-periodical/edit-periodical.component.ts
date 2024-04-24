import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { DataService } from '../../../../../../../services/data.service';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-periodical',
  templateUrl: './edit-periodical.component.html',
  styleUrl: './edit-periodical.component.scss'
})

export class EditPeriodicalComponent implements OnInit{
  ngOnInit(): void {
    console.log(this.data)
  }

  constructor(private ref: MatDialogRef<EditPeriodicalComponent>, 
    private buildr: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private ds: DataService
  ) { }


  closepopup() {
    this.ref.close('Closed using function');
  }

  // SWEETALERT UPDATE POPUP
  updateBox(){
    Swal.fire({
      title: "Update Details",
      text: "Are you sure you want to update the periodical details?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
      confirmButtonColor: "#31A463",
      cancelButtonColor: "#777777",
    }).then((result) => {
      if (result.isConfirmed) {
        this.ref.close('Closed using function');
        Swal.fire({
          title: "Update successful!",
          text: "The changes have been saved.",
          icon: "success",
          confirmButtonText: 'Close',
          confirmButtonColor: "#777777",
        });
      }
    });
  }

  // SWEETALERT ARCHIVE POPUP
  archiveBox(){
    Swal.fire({
      title: "Archive Periodical",
      text: "Are you sure want to archive this periodical?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
      confirmButtonColor: "#AB0E0E",
      cancelButtonColor: "#777777",
    }).then((result) => {
      if (result.isConfirmed) {
        this.ref.close('Closed using function');
        Swal.fire({
          title: "Archiving complete!",
          text: "Periodical has been safely archived.",
          icon: "success",
          confirmButtonText: 'Close',
          confirmButtonColor: "#777777",
        });
      }
    });
  }
}