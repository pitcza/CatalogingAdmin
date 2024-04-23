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

  protected image: any = null;

  ngOnInit(): void {

    this.ds.getImage('project/image/' + this.data.details.id).subscribe((data: Blob) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.image = e.target.result;
      };
      reader.readAsDataURL(data);
    }, (error: any) => {
      console.log(error);
      this.image = 'https://raw.githubusercontent.com/pitcza/sampleimages/main/NoImage.png';
    });
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
    }).then((result) => {
      if (result.isConfirmed) {
        this.ref.close('Closed using function');
        Swal.fire({
          title: "Archiving complete!",
          text: "Project has been safely archived.",
          icon: "success"
        });
      }
    });
}
}