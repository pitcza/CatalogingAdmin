import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-article-details-popup',
  templateUrl: './article-details-popup.component.html',
  styleUrl: './article-details-popup.component.scss'
})
export class ArticleDetailsPopupComponent {
  constructor(
    private ref: MatDialogRef<ArticleDetailsPopupComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private buildr: FormBuilder,
    private dialog: MatDialog
  ) { }


  closepopup() {
    this.ref.close('Closed using function');
  }

  // SWEETALERT ARCHIVE POP UP
  archiveBox(){
    Swal.fire({
      title: "Archive Article",
      text: "Are you sure want to archive this article?",
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
          text: "Article has been safely archived.",
          icon: "success"
        });
      }
    });
  }

}
