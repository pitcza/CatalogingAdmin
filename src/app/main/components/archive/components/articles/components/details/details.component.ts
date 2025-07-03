import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from '../../../../../../../services/data/data.service';

import { MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
})
export class DetailsComponent {
  constructor(
    private router: Router,
    private ref: MatDialogRef<DetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ds: DataService
  ) {}

  element: any;
  errorImage = 'assets/images/NoImage.png';
  type: string = '';

  ngOnInit(): void {
    this.ds
      .request('GET', 'archives/material/id/' + this.data, null)
      .subscribe({
        next: (res: any) => {
          this.element = res;
          switch (this.element.periodical_type) {
            case 0:
              this.type = 'Journal';
              break;

            case 1:
              this.type = 'Magazine';
              break;

            case 2:
              this.type = 'Newspaper';
              break;
          }
        },
      });
  }

  // nadidisplay kasi nang tuloy-tuloy yung maraming paragraphs, nagiging iisang paragraph hehe ito raw solusyon sabi ni tropang chatgpt
  formatAbstract(abstract: string | null): string {
    if (!abstract) {
      return 'N/A';
    }
    return abstract.replace(/\n/g, '<br>');
  }

  closepopup(text: string) {
    this.ref.close(text);
  }

  // RESTORE PROCESS/POPUP
  restoreBox(accession: any) {
    Swal.fire({
      title: 'Restore ' + this.type + ' Article',
      text:
        'Are you sure you want to restore this ' +
        this.type.toLowerCase() +
        ' article?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#4F6F52',
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
          .request('POST', 'materials/restore/' + accession, null)
          .subscribe({
            next: (res: any) => {
              Swal.fire({
                title: 'Restoring Complete!',
                text:
                  'The ' +
                  this.type.toLowerCase() +
                  ' article has been restored successfully.',
                icon: 'success',
                confirmButtonText: 'Close',
                confirmButtonColor: '#777777',
                scrollbarPadding: false,
                willOpen: () => {
                  document.body.style.overflowY = 'scroll';
                },
                willClose: () => {
                  document.body.style.overflowY = 'scroll';
                },
                timer: 5000,
              });
              this.closepopup('close');
            },
            error: (err: any) => {},
          });
      }
    });
  }

  // PERMANENTLY DELETE
  deleteBox(accession: any) {
    Swal.fire({
      title: 'Permanent Deletion',
      text:
        'Are you sure you want to permanently delete this ' +
        this.type.toLowerCase() +
        ' article? This action cannot be undone.',
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
          .request('DELETE', 'permanently-delete/materials/' + accession, null)
          .subscribe({
            next: (res: any) => {
              Swal.fire({
                title: this.type + 'Article Permanently Deleted',
                text:
                  'The ' +
                  this.type.toLowerCase() +
                  ' article has been permanently deleted and cannot be recovered.',
                icon: 'success',
                confirmButtonText: 'Close',
                confirmButtonColor: '#777777',
                scrollbarPadding: false,
                willOpen: () => {
                  document.body.style.overflowY = 'scroll';
                },
                willClose: () => {
                  document.body.style.overflowY = 'scroll';
                },
              });
              this.closepopup('close');
            },
            error: (err: any) => {
              Swal.fire({
                title: 'Error!',
                text: err.message,
                icon: 'success',
                confirmButtonText: 'Close',
                confirmButtonColor: '#777777',
                scrollbarPadding: false,
                willOpen: () => {
                  document.body.style.overflowY = 'scroll';
                },
                willClose: () => {
                  document.body.style.overflowY = 'scroll';
                },
                timer: 5000,
              });
            },
          });
      }
    });
  }
}
