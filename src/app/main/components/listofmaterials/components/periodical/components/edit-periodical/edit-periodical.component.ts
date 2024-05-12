import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { DataService } from '../../../../../../../services/data.service';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-periodical',
  templateUrl: './edit-periodical.component.html',
  styleUrl: './edit-periodical.component.scss'
})

export class EditPeriodicalComponent {

  constructor(private ref: MatDialogRef<EditPeriodicalComponent>, 
    private buildr: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private ds: DataService,
    private router: Router
  ) { }


  closepopup() {
    this.ref.close('Closed using function');
  }

  // SWEETALERT UPDATE POPUP
  // updateBox(){
  //   Swal.fire({
  //     title: "Update Details",
  //     text: "Are you sure you want to update the periodical details?",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonText: 'Yes',
  //     cancelButtonText: 'Cancel',
  //     confirmButtonColor: "#31A463",
  //     cancelButtonColor: "#777777",
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       this.ref.close('Closed using function');
  //       Swal.fire({
  //         title: "Update successful!",
  //         text: "The changes have been saved.",
  //         icon: "success",
  //         confirmButtonText: 'Close',
  //         confirmButtonColor: "#777777",
  //       });
  //     }
  //   });
  // }

  // SWEETALERT ARCHIVE POPUP
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

  // CANCEL EDITING POPUP
  cancelBox(){
    Swal.fire({
      title: "Are you sure you want to cancel editing details?",
      text: "Your changes will not be saved.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      confirmButtonColor: "#AB0E0E",
      cancelButtonColor: "#777777",
    }).then((result) => {
      if (result.isConfirmed) {
          this.ref.close('Closed using function');
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
  
  protected updateBox() {
    var form = document.getElementById('edit-form') as HTMLFormElement;

      // Get the form elements
    const elements = form.elements

    let formData = new FormData();
    let valid = true;
    let validFile = true;
    const fields = ['title', 'author', 'copyright', 'pages', 'acquired_date', 'source_of_fund',
      'location_id', 'price', 'call_number', 'copies'];

    // Loop through each form element
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i] as HTMLInputElement;

      // Check if the element is an input field
      if (element.tagName === 'INPUT' || element.tagName === 'SELECT') {

        if (element.type !== 'file' && element.id !== 'submit') {
          formData.append(element.name, element.value);
        } else if (element.type === 'file' && element.files && element.files.length > 0) {
          formData.append(element.name, element.files[0]);const file = element.files[0];
          if(file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png') {
            formData.append(element.name, element.files[0]);
          } else {
            validFile = false;
          }
        }

        if(fields.includes(element.name) && element.value == '') {
          valid = false;
          element.style.borderColor = 'red';
        } else 
            element.style.borderColor = 'black';

      }
    }

    if(valid && validFile) {
      formData.append('_method', 'PUT');
      this.ds.post('periodicals/process/' + this.data.details.id, formData).subscribe({
        next: (res: any) => {
          Swal.fire({
            title: "Update successful!",
            text: "The changes have been saved.",
            icon: "success"
          });
          this.ref.close('Changed Data');
        },
        error:(err: any) => {
          console.log(err);
          Swal.fire({
            title: 'Error',
            text: "Oops an error occured",
            icon: 'error',
            confirmButtonText: 'Close',
            confirmButtonColor: "#777777",
          });
        }
      });
    } else if (!validFile) {
      Swal.fire({
        title: 'Oops! Error on form',
        text: 'Invalid image. Must be of type png, jpeg, or jpg.',
        icon: 'error',
        confirmButtonText: 'Close',
        confirmButtonColor: "#777777",
      });
    } else {
      Swal.fire({
        title: 'Oops! Error on form',
        text: 'Please check if required fields have values',
        icon: 'error',
        confirmButtonText: 'Close',
        confirmButtonColor: "#777777",
      });
    }
  }
}