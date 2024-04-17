import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { DataService } from '../../../../../services/data.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-periodical',
  templateUrl: './edit-periodical.component.html',
  styleUrl: './edit-periodical.component.scss'
})
export class EditPeriodicalComponent implements OnInit{
  ngOnInit(): void {
  }

  constructor(private ref: MatDialogRef<EditPeriodicalComponent>, 
    private buildr: FormBuilder,
    private ds: DataService
  ) { }


  closepopup() {
    this.ref.close('Closed using function');
  }

  // SWEETALERT UPDATE POPUP
  updateBox(){
    Swal.fire({
      title: "Update Details",
      text: "Are you sure you want to update the book details?",
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
          icon: "success"
        });
      }
    });
  }

  // SWEETALERT ARCHIVE POPUP
  archiveBox(){
    Swal.fire({
      title: "Archive Book",
      text: "Are you sure want to archive this book?",
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
          text: "Book has been safely archived.",
          icon: "success"
        });
      }
    });
  }
}