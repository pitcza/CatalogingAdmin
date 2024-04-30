import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import Swal from 'sweetalert2';
import { DataService } from '../../../../../../../services/data.service';

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
    private ds: DataService
  ) { }

  protected image: any;

  ngOnInit(): void {
    
    this.ds.getImage('periodical/image/' + this.data.details.id).subscribe({
      next: (res:any) => {
        this.image = URL.createObjectURL(res)
      },
      error: (err: any) => {
        this.image = 'https://raw.githubusercontent.com/pitcza/sampleimages/main/NoImage.png';
      }
    });    
  }

  closepopup() {
    this.ref.close('Closed using function');
  }

  // SWEETALERT ARCHIVE POP UP
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
    }).then((result) => {
      if (result.isConfirmed) {
        this.ref.close('Closed using function');
        Swal.fire({
          title: "Archiving complete!",
          text: "Periodical has been safely archived.",
          icon: "success",
          confirmButtonText: 'Close',
          confirmButtonColor: "#777777",
        });
      }
    });
  }

}
