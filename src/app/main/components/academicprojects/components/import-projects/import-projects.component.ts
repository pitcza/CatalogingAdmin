import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-import-projects',
  templateUrl: './import-projects.component.html',
  styleUrl: './import-projects.component.scss'
})
export class ImportProjectsComponent {
  constructor (
    private router: Router,
    private ref: MatDialogRef<ImportProjectsComponent>,
  ) { }

  closepopup() {
    this.ref.close('popup closed');
  }

  addBox(){
    Swal.fire({
      title: "Import Projects",
      text: "Are you sure you want to import the selected file?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
      confirmButtonColor: "#4f6f52",
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
        this.closepopup()
        Swal.fire({
          title: "Import successful!",
          text: "File imported successfully.",
          icon: "success",
          confirmButtonColor: "#4F6F52",
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

  cancelBox(){
    Swal.fire({
      title: "Are you sure you want to cancel?",
      text: "Your changes will not be saved.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
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
        this.closepopup()
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2500,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "error",
          title: "Changes not saved."
        });
      }
    });
  }

}
