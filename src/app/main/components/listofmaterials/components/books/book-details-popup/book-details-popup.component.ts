import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import Swal from 'sweetalert2';

import { Router } from '@angular/router';
import { DataService } from '../../../../../../services/data/data.service';

@Component({
  selector: 'app-book-details-popup',
  templateUrl: './book-details-popup.component.html',
  styleUrl: './book-details-popup.component.scss',
  standalone: true,
  imports: [CommonModule],
})
export class BookDetailsPopupComponent {
  constructor(
    private ref: MatDialogRef<BookDetailsPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private buildr: FormBuilder,
    private ds: DataService,
    private router: Router
  ) {}

  errorImage = 'assets/images/NoImage.png';
  book: any;

  ngOnInit(): void {
    this.ds
      .request('GET', 'material/id/' + this.data.accession, null)
      .subscribe({
        next: (res: any) => {
          this.book = res;
        },
      });
  }

  closepopup(text: string) {
    this.ref.close(text);
  }

  // SWEETALERT ARCHIVE POP UP
  archiveBox() {
    Swal.fire({
      title: 'Archive Book',
      text: 'Are you sure you want to archive this book?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#AB0E0E',
      cancelButtonColor: '#777777',
      scrollbarPadding: false,
      willOpen: () => {
        document.body.style.overflowY = 'scroll';
      },
      willClose: () => {
        document.body.style.overflowY = 'scroll';
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.ds
          .request('DELETE', 'materials/archive/' + this.book.accession, null)
          .subscribe({
            next: (res: any) => {
              Swal.fire({
                title: 'Archiving complete!',
                text: 'Book has been safely archived.',
                icon: 'success',
                confirmButtonText: 'Close',
                confirmButtonColor: '#777777',
                scrollbarPadding: false,
                timer: 5000,
              });
              this.closepopup('Archive');
            },
            error: (err: any) => {
              Swal.fire({
                title: 'Error',
                text: err.error.message,
                icon: 'error',
                confirmButtonText: 'Close',
                confirmButtonColor: '#777777',
                scrollbarPadding: false,
              });
            },
          });
      }
    });
  }
}
