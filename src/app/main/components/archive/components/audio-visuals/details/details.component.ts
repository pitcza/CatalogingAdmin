import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from '../../../../../../services/data/data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit {
  constructor (
    private router: Router,
    private ref: MatDialogRef<DetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ds: DataService
  ) { }

  element: any;
  errorImage = '../../../../../../assets/images/NoImage.png';

  ngOnInit(): void {
    this.ds.request('GET', 'archives/material/id/' + this.data, null).subscribe({
      next: (res: any) => {
        this.element = res;
      }
    })
  }

  closepopup(text: string) {
    this.ref.close(text);
  }

   // RESTORE PROCESS/POPUP
   restoreBox(accession: any){
    Swal.fire({
      title: 'Restore Audio-Visual',
      text: 'Are you sure you want to restore this audio-visual?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
      confirmButtonColor: "#4F6F52",
      cancelButtonColor: "#777777",
      scrollbarPadding: false,
      willOpen: () => {
        document.body.style.overflowY = 'scroll';
      },
      willClose: () => {
        document.body.style.overflowY = 'scroll';
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.ds.request('POST', 'materials/restore/' + accession, null).subscribe({
          next: (res: any) => {
            Swal.fire({
              title: "Restoring Complete!",
              text: "Audio-visual has been restored successfully.",
              icon: "success",
              confirmButtonText: 'Close',
              confirmButtonColor: "#777777",
              scrollbarPadding: false,
              willOpen: () => {
                document.body.style.overflowY = 'scroll';
              },
              willClose: () => {
                document.body.style.overflowY = 'scroll';
              },
              timer: 5000
            });
            this.closepopup('close')
          },
          error: (err: any) => {
            Swal.fire({
              title: "Error!",
              text: err.message,
              icon: "success",
              confirmButtonText: 'Close',
              confirmButtonColor: "#777777",
              scrollbarPadding: false,
              willOpen: () => {
                document.body.style.overflowY = 'scroll';
              },
              willClose: () => {
                document.body.style.overflowY = 'scroll';
              },
              timer: 5000
            });
          }          
        })
      }
    });
  }

  // PERMANENTLY DELETE
  deleteBox(accession: any){
    Swal.fire({
      title: 'Permanent Deletion',
      text: 'Are you sure you want to permanently delete this audio-visual? This action cannot be undone.',
      icon: 'warning',
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
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.ds.request('DELETE', 'permanently-delete/materials/' + accession, null).subscribe({
          next: (res: any) => {
            Swal.fire({
              title: "Audio-visual Permanently Deleted",
              text: "Audio-visual has been permanently deleted and cannot be recovered.",
              icon: "success",
              confirmButtonText: 'Close',
              confirmButtonColor: "#777777",
              scrollbarPadding: false,
              willOpen: () => {
                document.body.style.overflowY = 'scroll';
              },
              willClose: () => {
                document.body.style.overflowY = 'scroll';
              },
            });
            this.closepopup('close')
          }, error: (err: any) => {
            Swal.fire({
              title: "Error!",
              text: err.message,
              icon: "success",
              confirmButtonText: 'Close',
              confirmButtonColor: "#777777",
              scrollbarPadding: false,
              willOpen: () => {
                document.body.style.overflowY = 'scroll';
              },
              willClose: () => {
                document.body.style.overflowY = 'scroll';
              },
              timer: 5000
            });
          }
        });
      }
    });
  }
}

