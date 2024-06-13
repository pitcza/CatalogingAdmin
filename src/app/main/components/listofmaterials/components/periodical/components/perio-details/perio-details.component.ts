import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import Swal from 'sweetalert2';
import { DataService } from '../../../../../../../services/data.service';
import { PeriodicalService } from '../../../../../../../services/materials/periodical/periodical.service';

@Component({
  selector: 'app-perio-details',
  templateUrl: './perio-details.component.html',
  styleUrl: './perio-details.component.scss'
})

export class PerioDetailsComponent implements OnInit {
  constructor(
    private ref: MatDialogRef<PerioDetailsComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private buildr: FormBuilder,
    private dialog: MatDialog,
    private ds: DataService,
    private periodicalService: PeriodicalService
  ) { }

  periodical: any;
  protected image: any;
  errorImage = '../../../../../../assets/images/NoImage.png';

  ngOnInit(): void {
    console.log(this.data)
     this.periodicalService.getRecord(this.data.details).subscribe((res: any) => {
        this.periodical = res;
        console.log(this.periodical)
     })
  }

  closepopup() {
    this.ref.close('Closed using function');
  }

  // ARCHIVE POP UP
  archiveBox(){
    Swal.fire({
      title: "Archive Periodical",
      text: "Are you sure want to archive this periodical?",
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
        this.periodicalService.deleteRecord(this.periodical.accession).subscribe({
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
