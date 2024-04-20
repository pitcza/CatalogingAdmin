import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import Swal from 'sweetalert2';
import { DataService } from '../../../../../services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-periodical-details-popup',
  templateUrl: './periodical-details-popup.component.html',
  styleUrl: './periodical-details-popup.component.scss'
})
export class PeriodicalDetailsPopupComponent {
  constructor(
    private ref: MatDialogRef<PeriodicalDetailsPopupComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private buildr: FormBuilder,
    private dialog: MatDialog,
    private ds: DataService,
    private router: Router
  ) { }

  protected image: any = null;

  ngOnInit(): void {
    console.log(this.data.details.id)
      this.ds.getImage('periodical/image/', this.data.details.id).subscribe({
        next: (res:any) => {
          this.image = URL.createObjectURL(res)
        },
        error: (err: any) => {
          this.image = 'https://raw.githubusercontent.com/pitcza/sampleimages/main/NoImage.png';
          console.log(err)
        }
      });
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
    }).then((result) => {
      if (result.isConfirmed) {
        this.ds.delete('books/process/', this.data.details.id).subscribe({
          next: (res: any) => {
            Swal.fire({
              title: "Archiving complete!",
              text: "Book has been safely archived.",
              icon: "success",
            });
            this.ref.close('Closed using function');
            this.router.navigate(['listofmaterials/books']);
          },
          error: (err: any) => {
            Swal.fire({
              title: "Error",
              text: "Oops an error occured.",
              icon: "error"
            });
            console.log(err);
          }
        });
      };
    });
  }

  // closepopup() {
  //   this.ref.close('Closed using function');
  // }

  // // SWEETALERT ARCHIVE POP UP
  // archiveBox(){
  //   Swal.fire({
  //     title: "Archive Periodical",
  //     text: "Are you sure want to archive this periodical?",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonText: 'Yes',
  //     cancelButtonText: 'Cancel',
  //     confirmButtonColor: "#AB0E0E",
  //     cancelButtonColor: "#777777",
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       this.ref.close('Closed using function');
  //       Swal.fire({
  //         title: "Archiving complete!",
  //         text: "Periodical has been safely archived.",
  //         icon: "success"
  //       });
  //     }
  //   });
  // }

}
