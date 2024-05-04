import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { DataService } from '../../../../../../../services/data.service';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import Swal from 'sweetalert2';

interface MyOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-edit-article',
  templateUrl: './edit-article.component.html',
  styleUrl: './edit-article.component.scss'
})
export class EditArticleComponent implements OnInit{
  ngOnInit(): void {
  }

  constructor(private ref: MatDialogRef<EditArticleComponent>, 
    private buildr: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private ds: DataService
  ) { }


  closepopup() {
    this.ref.close('Closed using function');
  }

  // SWEETALERT UPDATE POPUP
  // updateBox(){
  //   Swal.fire({
  //     title: "Update Details",
  //     text: "Are you sure you want to update the article details?",
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
      title: "Archive Article",
      text: "Are you sure want to archive this article?",
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
          text: "Article has been safely archived.",
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
    const elements = form.elements;

    // Create an object to store form values
    // var formData : { [key: string]: any } = {};

    let formData = new FormData();

    // Loop through each form element
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i] as HTMLInputElement;

      // Check if the element is an input field
      if (element.tagName === 'INPUT' || element.tagName === 'SELECT') {

        if (element.type !== 'file' && element.id !== 'submit' && element.value !== '') {
          formData.append(element.name, element.value);
        } else if (element.type === 'file' && element.files && element.files.length > 0) {
          formData.append(element.name, element.files[0]);
        }

      }
    }

    formData.forEach((value, key) => {
      console.log("%s: %s", key, value);
    })

    formData.append('_method', 'PUT');
    this.ds.post('articles/process/' + this.data.details.id, formData).subscribe({
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
  }
}