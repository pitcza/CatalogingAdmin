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

  protected locations: any;
  book: any;
  image: any;
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
      this.editForm.patchValue({
        accession: this.book.accession,
        title: this.book.title,
        publisher: this.book.publisher,
        copyright: this.book.copyright,
        location: this.book.location,
        call_number: this.book.call_number,
        author_number: this.book.author_number,
        volume: this.book.volume,
        edition: this.book.edition,
        pages: this.book.pages,
        remarks: this.book.remarks,
        acquired_date: this.book.acquired_date,
        source_of_fund: this.book.source_of_fund,
        price: this.book.price,
      });

      this.values = this.book.authors;
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

    if(type == 'Purchased') {
      this.editForm.get('price')?.enable();
    } else {
      this.editForm.get('price')?.disable();
    }
  }

  uploadImage(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
        this.image = file;
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
    this.editForm.patchValue({
      authors: JSON.stringify(this.values)
    });

    if(this.editForm.valid) {
      
      // pass datas to formdata to allow sending of files
      let form = new FormData();
      
      Object.entries(this.editForm.value).forEach(([key, value]: [string, any]) => {
        if(value != '' && value != null)
          form.append(key, value);
      });

      if(this.image) {
        form.append('image_url', this.image);
      }

      this.bookService.updateRecord(this.data.accession, form).subscribe({
        next: (res: any) => {
          Swal.fire({
            title: 'Success',
            text: "Book has been updated successfully!",
            icon: 'success',
            confirmButtonText: 'Close',
            confirmButtonColor: "#777777",
          });
        },
        error: (err: any) => {
          Swal.fire({
            title: 'Oops! Server Side Error!',
            text: 'Please try again later or contact the developers',
            icon: 'error',
            confirmButtonText: 'Close',
            confirmButtonColor: "#777777",
          });
        }
      });
    } else {
      Swal.fire({
        title: 'Oops! Submission Error!',
        text: 'Invalid Form',
        icon: 'error',
        confirmButtonText: 'Close',
        confirmButtonColor: "#777777",
      });
    }
  }
}