import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { BookService } from '../../../../../services/materials/book/book.service';

@Component({
  selector: 'app-edit-book',
  templateUrl: './edit-book.component.html',
  styleUrl: './edit-book.component.scss'
})
export class EditBookComponent implements OnInit{

  protected locations: any = null;
  book: any;
  isPurchased = false;
  year: number[] = [];
  currentYear = new Date().getFullYear();
  maxAuthors = 3;
  editForm: FormGroup;
  values = [];

  constructor(
    private ref: MatDialogRef<EditBookComponent>, 
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private bookService: BookService,
    private router: Router
  ) { 
    for(let i = 1901; i <= this.currentYear; i++) {
      this.year.push(i);
    }

    this.editForm = formBuilder.group({
      accession: ['', Validators.required],
      title: ['', [Validators.required, Validators.maxLength(255)]],
      authors: ['', Validators.required],
      publisher: ['', Validators.required],
      remarks: [''],
      pages: ['', Validators.required],
      copyright: [2024, Validators.required],
      volume: [''],
      edition: [''],
      acquired_date: ['', Validators.required],
      source_of_fund: ['Purchased', Validators.required],
      price: [''],
      location: ['ABCOMM', Validators.required],
      call_number: ['', Validators.required],
      author_number: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.bookService.getRecord(this.data.accession).subscribe((res: any) => {
      this.book = res;

      this.values = this.book.authors;
      console.log(this.book)
    })

    this.bookService.getLocations().subscribe((res: any) => {
      this.locations = res;
    })
  }

  closepopup() {
    this.ref.close('Closed using function');
  }

  sourceOfFundEvent(event: Event) {
    let type = (event.target as HTMLSelectElement).value;

    if(type == '0') {
      this.isPurchased = true;
    } else {
      this.isPurchased = false;
    }
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
          text: "Book has been safely archived.",
          icon: "success",
          confirmButtonText: 'Close',
          confirmButtonColor: "#777777",
          scrollbarPadding: false,
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
      }
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
  get authors(): FormArray {
    return this.editForm.get('authors') as FormArray;
  }

  addAuthor(): void {
    if (this.authors.length < this.maxAuthors) {
      this.authors.push(this.formBuilder.control('', Validators.required));
    }
  }

  removeAuthor(index: number): void {
    if (this.authors.length > 1) {
      this.authors.removeAt(index);
    }
  }

  isMaxLimitReached(): boolean {
    return this.authors.length >= this.maxAuthors;
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }

  onSubmit() {
    if (this.editForm.valid) {
      console.log(this.editForm.value);
    }
  }
  // values = [''];

  // // Track by function to minimize re-renders
  // trackByIndex(index: number, item: any): number {
  //   return index;
  // }

  // removeAuthor(event: Event) {
  //   let targetElement = event.target;

  //   // Get the author div
  //   let element = ((targetElement as HTMLElement).parentNode)?.parentNode;
  //   element?.parentNode?.removeChild(element);
  // }

  // removevalue(i: any){
  //   this.values.splice(i, 1);
  // }

  // addvalue(){
  //   if (this.values.length < 3) {
  //     this.values.push('');
  //   }
  //   console.log(this.values)
  // }

  // updateValue($event: Event, index: number) {
  //   // this.values[index] = $event.target.value;
  //   console.log($event)
  // }

  // isMaxLimitReached(): boolean {
  //   return this.values.length >= 3;
  // }
  // ----- END OF AUTHORS ----- //

  protected updateBook() {
    console.log(this.editForm)
    // var form = document.getElementById('edit-form') as HTMLFormElement;

    //   // Get the form elements
    // const elements = form.elements;
    
    // let valid = true;
    // let validFile = true;
    // const fields = ['accession', 'title', 'author', 'copyright', 'pages', 'acquired_date', 'source_of_fund',
    //   'location_id', 'price', 'call_number', 'copies'];

    // let formData = new FormData();
    // let authors = [];

    // // Loop through each form element
    // for (let i = 0; i < elements.length; i++) {
    //   const element = elements[i] as HTMLInputElement;

    //   // Check if the element is an input field
    //   if (element.tagName === 'INPUT' || element.tagName === 'SELECT') {

    //     if(element.name == 'author') {
    //       authors.push(element.value);
    //     } else if (element.type !== 'file' && element.id !== 'submit') {
    //       formData.append(element.name, element.value);
    //     } else if (element.type === 'file' && element.files && element.files.length > 0) {
    //       const file = element.files[0];
    //           if(file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png') {
    //             formData.append(element.name, element.files[0]);
    //           } else {
    //             validFile = false;
    //           }
    //     }

    //     if(fields.includes(element.name) && element.value == '') {
    //       valid = false;
    //       element.style.borderColor = 'red';
    //     } else 
    //         element.style.borderColor = 'black';

    //   }
    // }

    // formData.append('authors', JSON.stringify(authors));
    // if(valid && validFile) {
    //   this.bookService.updateRecord(this.data.accession, formData).subscribe({
    //     next: (res: any) => {
    //       console.log(res)
    //       Swal.fire({
    //         title: "Update successful!",
    //         text: "The changes have been saved.",
    //         icon: "success",
    //         confirmButtonColor: "#4F6F52",
    //         scrollbarPadding: false,
    //         willOpen: () => {
    //           document.body.style.overflowY = 'scroll';
    //         },
    //         willClose: () => {
    //           document.body.style.overflowY = 'scroll';
    //         },
    //         timer: 5000,
    //       });
    //       this.ref.close('Changed Data');
    //     },
    //     error:(err: any) => {
    //       console.log(err);
    //       Swal.fire({
    //         title: 'Error',
    //         text: "Oops an error occured",
    //         icon: 'error',
    //         confirmButtonText: 'Close',
    //         confirmButtonColor: "#777777",
    //         scrollbarPadding: false,
    //         willOpen: () => {
    //           document.body.style.overflowY = 'scroll';
    //         },
    //         willClose: () => {
    //           document.body.style.overflowY = 'scroll';
    //         }
    //       });
    //     }
    //   });
    // } else if (!validFile) {
    //   Swal.fire({
    //     title: 'Oops! Error on form',
    //     text: 'Invalid image. Must be of type png, jpeg, or jpg.',
    //     icon: 'error',
    //     confirmButtonText: 'Close',
    //     confirmButtonColor: "#777777",
    //     scrollbarPadding: false,
    //     willOpen: () => {
    //       document.body.style.overflowY = 'scroll';
    //     },
    //     willClose: () => {
    //       document.body.style.overflowY = 'scroll';
    //     }
    //   });
    // } else {
    //   Swal.fire({
    //     title: 'Oops! Error on form',
    //     text: 'Please check if required fields have values',
    //     icon: 'error',
    //     confirmButtonText: 'Close',
    //     confirmButtonColor: "#777777",
    //     scrollbarPadding: false,
    //     willOpen: () => {
    //       document.body.style.overflowY = 'scroll';
    //     },
    //     willClose: () => {
    //       document.body.style.overflowY = 'scroll';
    //     }
    //   });
    // }
  }
}