import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import Swal from 'sweetalert2';
import { DataService } from '../../../../../../services/data/data.service';

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
  
  errorImage = '../../../../../../assets/images/NoImage.png';
  element = {
    abstract: '',
    accession: '',
    archived_at: '',
    authors: [],
    category: '',
    created_at: '',
    date_published: '',
    image_url: '',
    keywords: [],
    language: '',
    program: '',
    title: ''
  };

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

  ngOnInit(): void {
    this.ds.request('GET', 'archives/project/id/' + this.data, null).subscribe({
      next: (res: any) => {
        this.element = res;
      }
    })
  }

  // RESTORE PROCESS/POPUP
  restoreBox(accession: any){
    Swal.fire({
      title: 'Restore Academic Project',
      text: 'Are you sure you want to restore this academic project?',
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
        this.ds.request('POST', 'projects/restore/' + accession, null).subscribe({
          next: (res: any) => {
            Swal.fire({
              title: "Restoring Complete!",
              text: "Academic project has been restored successfully.",
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
            this.closepopup('Restore');
          },
          error: (err: any) => {}          
        })
      }
    });
  }

  // PERMANENTLY DELETE
  deleteBox(accession: any){
    Swal.fire({
      title: 'Permanent Deletion',
      text: 'Are you sure you want to permanently delete this academic project? This action cannot be undone.',
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
        this.ds.request('DELETE', 'permanently-delete/projects/' + accession, null).subscribe({
          next: (res: any) => {
            Swal.fire({
              title: "Academic Project Permanently Deleted",
              text: "Academic project has been permanently deleted and cannot be recovered.",
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
            this.closepopup('Delete')
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