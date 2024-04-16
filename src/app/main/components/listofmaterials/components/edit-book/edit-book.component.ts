import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-book',
  templateUrl: './edit-book.component.html',
  styleUrl: './edit-book.component.scss'
})
export class EditBookComponent implements OnInit{
  ngOnInit(): void {
  }

  constructor(private ref: MatDialogRef<EditBookComponent>, private buildr: FormBuilder,) {
  }

  closepopup() {
    this.ref.close('Closed using function');
  }

  // SWEETALERT DELETE POPUP
  deleteBox(){
    Swal.fire({
      title: 'Are you sure want to delete this material?',
      text: 'You will not be able to recover this book.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      confirmButtonColor: "#AB0E0E",
      cancelButtonColor: "#777777",
    }).then((result) => {
      if (result.value) {
        Swal.fire(
          'Deleted',
          'Book has been successfully deleted.',
          'success'
        )
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'The book is safe.',
          'error'
        )
      }
    })
  }
}
