import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { DataService } from '../../../../../services/data.service';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-book',
  templateUrl: './edit-book.component.html',
  styleUrl: './edit-book.component.scss'
})
export class EditBookComponent implements OnInit{

  protected locations: any = null;

  ngOnInit(): void {
    this.ds.get('books/locations', '').subscribe((res: any) => {
      this.locations = res;
      console.log(this.locations)
    })
  }

  constructor(
    private ref: MatDialogRef<EditBookComponent>, 
    private buildr: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private ds: DataService, 
    private router: Router
  ) { }


  closepopup() {
    this.ref.close('Closed using function');
  }

  // SWEETALERT UPDATE POPUP
  updateBox(){
    Swal.fire({
      title: "Update Details",
      text: "Are you sure you want to update the book details?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
      confirmButtonColor: "#31A463",
      cancelButtonColor: "#777777",
    }).then((result) => {
      if (result.isConfirmed) {
        this.ref.close('Closed using function');
        Swal.fire({
          title: "Update successful!",
          text: "The changes have been saved.",
          icon: "success"
        });
      }
    });
  }

  // SWEETALERT ARCHIVE POPUP
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
      if (result.value) {
        Swal.fire(
          'Deleted',
          'Book has been successfully deleted.',
          'success'
        )
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'The book is safe.',
          'error'
        )
      }
    });
  }

  protected updateBook() {
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
    this.ds.post('books/process/', this.data.details, formData).subscribe({
      next: (res: any) => {
        console.log(res)
        Swal.fire({
          title: "Update successful!",
          text: "The changes have been saved.",
          icon: "success"
        });
        this.ref.close('Closed using function');
        this.router.navigate(['listofmaterials/books']);
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
