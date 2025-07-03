import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import Swal from 'sweetalert2';
import { DataService } from '../../../../../services/data/data.service';

@Component({
  selector: 'app-details-popup',
  templateUrl: './details-popup.component.html',
  styleUrl: './details-popup.component.scss',
})
export class DetailsPopupComponent implements OnInit {
  errorImage = 'assets/images/NoImage.png';
  project: any;

  constructor(
    private ref: MatDialogRef<DetailsPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private buildr: FormBuilder,
    private ds: DataService
  ) {}

  ngOnInit(): void {
    this.ds
      .request('GET', 'project/id/' + this.data.details, null)
      .subscribe((res: any) => {
        this.project = res;
        console.log(this.project);
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

  archiveBox() {
    Swal.fire({
      title: 'Archive Project',
      text: 'Are you sure you want to archive this project?',
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
          .request('DELETE', 'projects/archive/' + this.data.details, null)
          .subscribe({
            next: (res: any) => {
              Swal.fire({
                title: 'Archiving complete!',
                text: 'Project has been successfully archived.',
                icon: 'success',
                confirmButtonText: 'Close',
                confirmButtonColor: '#777777',
                scrollbarPadding: false,
              });
              this.closepopup('Archive');
            },
          });
      }
    });
  }
}
