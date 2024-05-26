import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from '../../../../../services/data.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-details-popup',
  templateUrl: './details-popup.component.html',
  styleUrl: './details-popup.component.scss'
})
export class DetailsPopupComponent implements OnInit{

  errorImage = '../../../../../../assets/images/NoImage.png';

  ngOnInit(): void {
    console.log(this.data)
  }

  constructor(
    private ref: MatDialogRef<DetailsPopupComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private buildr: FormBuilder,
    private ds: DataService  
  ) { }

  closepopup() {
    this.ref.close('Closed using function');
  }

  archiveBox(){
    Swal.fire({
      title: "Archive Project",
      text: "Are you sure want to archive this project?",
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
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.ref.close('Closed using function');
        Swal.fire({
          title: "Archiving complete!",
          text: "Project has been safely archived.",
          icon: "success",
          confirmButtonText: 'Close',
          confirmButtonColor: "#777777",
          scrollbarPadding: false,
          timer: 5000,
        });
      }
    });
  }
}