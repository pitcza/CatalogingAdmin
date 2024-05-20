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
  ) { 
    this.values = data.details.authors;
  }


  closepopup() {
    this.ref.close('Closed using function');
  }

  // ARCHIVE POPUP
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
      scrollbarPadding: false,
      willOpen: () => {
        document.body.style.overflowY = 'scroll';
      },
      willClose: () => {
        document.body.style.overflowY = 'scroll';
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.ref.close('Closed using function');
        Swal.fire({
          title: "Archiving complete!",
          text: "Article has been safely archived.",
          icon: "success",
          confirmButtonText: 'Close',
          confirmButtonColor: "#777777",
          scrollbarPadding: false,
          timer: 5000,
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
      scrollbarPadding: false,
      willOpen: () => {
        document.body.style.overflowY = 'scroll';
      },
      willClose: () => {
        document.body.style.overflowY = 'scroll';
      },
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

  // ----- AUTHORS ----- //
  values = [''];

  // Track by function to minimize re-renders
  trackByIndex(index: number, item: any): number {
    return index;
  }

  removeAuthor(event: Event) {
    let targetElement = event.target;

    // Get the author div
    let element = ((targetElement as HTMLElement).parentNode)?.parentNode;
    element?.parentNode?.removeChild(element);
  }

  removevalue(i: any){
    this.values.splice(i, 1);
  }

  addvalue(){
    if (this.values.length < 3) {
      this.values.push('');
    }
    console.log(this.values)
  }

  updateValue($event: Event, index: number) {
    // this.values[index] = $event.target.value;
    console.log($event)
  }

  isMaxLimitReached(): boolean {
    return this.values.length >= 3;
  }
  // ----- END OF AUTHORS ----- //
  
  protected updateBox() {
    var form = document.getElementById('edit-form') as HTMLFormElement;

      // Get the form elements
    const elements = form.elements;

    // Create an object to store form values
    // var formData : { [key: string]: any } = {};

    let formData = new FormData();
    let valid = true;
    let authors = [];
    const fields = ['title', 'author', 'copyright', 'pages', 'acquired_date', 'source_of_fund',
      'location_id', 'price', 'call_number', 'copies'];

    // Loop through each form element
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i] as HTMLInputElement;

      // Check if the element is an input field
      if (element.tagName === 'INPUT' || element.tagName === 'SELECT') {

        if(element.name == 'author') {
          authors.push(element.value)
        }
        else if (element.type !== 'file' && element.id !== 'submit') {
          formData.append(element.name, element.value);
        } else if (element.type === 'file' && element.files && element.files.length > 0) {
          formData.append(element.name, element.files[0]);
        }

      }
    }

    formData.append('authors', JSON.stringify(authors));
    console.log(this.values)
    if(valid) {
      formData.append('_method', 'PUT');
      this.ds.post('articles/process/' + this.data.details.id, formData).subscribe({
        next: (res: any) => {
          console.log(res)
          Swal.fire({
            title: "Update successful!",
            text: "The changes have been saved.",
            icon: "success",
            confirmButtonColor: "#31A463",
            scrollbarPadding: false,
            willOpen: () => {
              document.body.style.overflowY = 'scroll';
            },
            willClose: () => {
              document.body.style.overflowY = 'scroll';
            },
            timer: 5000,
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
            scrollbarPadding: false,
            willOpen: () => {
              document.body.style.overflowY = 'scroll';
            },
            willClose: () => {
              document.body.style.overflowY = 'scroll';
            },
          });
        }
      });
    
  } else {
    Swal.fire({
      title: 'Oops! Error on form',
      text: 'Please check if required fields have values',
      icon: 'error',
      confirmButtonText: 'Close',
      confirmButtonColor: "#777777",
      scrollbarPadding: false,
      willOpen: () => {
        document.body.style.overflowY = 'scroll';
      },
      willClose: () => {
        document.body.style.overflowY = 'scroll';
      },
    });
  }
}
}