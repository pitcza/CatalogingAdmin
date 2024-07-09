import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import Swal from 'sweetalert2';

import { Router } from '@angular/router';
import { BookService } from '../../../../../../services/materials/book/book.service';

@Component({
  selector: 'app-book-details-popup',
  templateUrl: './book-details-popup.component.html',
  styleUrl: './book-details-popup.component.scss',
  standalone: true,
  imports: [
    CommonModule
  ],
})
export class BookDetailsPopupComponent {
  constructor(
    private ref: MatDialogRef<BookDetailsPopupComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private buildr: FormBuilder,
    private bookService: BookService,
    private router: Router
  ) { }

  errorImage = '../../../../../../assets/images/NoImage.png';
  book: any;

  ngOnInit(): void {
    this.bookService.getRecord(this.data.accession).subscribe({
      next: (res: any) =>  {
        this.book = res
        console.log(this.book)
      },
      error: (err: any) => console.log(err)
    })
  }

  closepopup() {
    this.ref.close('Closed using function');
  }

  // SWEETALERT ARCHIVE POP UP
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
      scrollbarPadding: false,
      willOpen: () => {
        document.body.style.overflowY = 'scroll';
      },
      willClose: () => {
        document.body.style.overflowY = 'scroll';
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.bookService.deleteRecord(this.book.accession).subscribe({
          next: (res: any) => {
            Swal.fire({
              title: "Archiving complete!",
              text: "Book has been safely archived.",
              icon: "success",
              confirmButtonText: 'Close',
              confirmButtonColor: "#777777",
              scrollbarPadding: false,
              timer: 5000
            });
            this.ref.close('Changed Data');
          },
          error: (err: any) => {
            Swal.fire({
              title: "Error",
              text: "Oops an error occured.",
              icon: "error",
              scrollbarPadding: false,
              willOpen: () => {
                document.body.style.overflowY = 'scroll';
              },
              willClose: () => {
                document.body.style.overflowY = 'scroll';
              },
            });
            console.log(err);
          }
        });
      };
    });
  }

}
