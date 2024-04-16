import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-book-details-popup',
  templateUrl: './book-details-popup.component.html',
  styleUrl: './book-details-popup.component.scss'
})
export class BookDetailsPopupComponent {
  constructor(
    private ref: MatDialogRef<BookDetailsPopupComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private buildr: FormBuilder,
  ) { }

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
