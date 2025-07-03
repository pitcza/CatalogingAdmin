import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';
import { DataService } from '../../../../../../services/data/data.service';

@Component({
  selector: 'app-view-av',
  templateUrl: './view-av.component.html',
  styleUrl: './view-av.component.scss',
  standalone: true,
  imports: [CommonModule],
})
export class ViewAVComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ref: MatDialogRef<ViewAVComponent>,
    private buildr: FormBuilder,
    private router: Router,
    private ds: DataService
  ) {}

  errorImage = 'assets/images/NoImage.png';
  model: any;

  ngOnInit(): void {
    this.ds
      .request('GET', 'material/id/' + this.data.accession, null)
      .subscribe((res: any) => {
        this.model = res;
      });
  }

  closepopup(text: string) {
    this.ref.close(text);
  }

  // ARCHIVE POPUP
  archiveBox() {
    Swal.fire({
      title: 'Archive Audio-Visual',
      text: 'Are you sure you want to archive this audio-visual?',
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
          .request('DELETE', 'materials/archive/' + this.data.accession, null)
          .subscribe({
            next: (res: any) => {
              this.closepopup('Archive');
              Swal.fire({
                title: 'Archiving complete!',
                text: 'Audio-Visual has been safely archived.',
                icon: 'success',
                confirmButtonText: 'Close',
                confirmButtonColor: '#777777',
                scrollbarPadding: false,
              });
            },
            error: (err: any) => {
              if (
                err.message.toLowerCase().includes('no query results for model')
              )
                var text = 'Cannot find material';
              else var text = 'Unknown error';

              Swal.fire({
                title: 'Oops! Archive Error!',
                text: text,
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
