import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { BookService } from '../../../../../../services/materials/book/book.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-book',
  templateUrl: './edit-book.component.html',
  styleUrl: './edit-book.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
})
export class EditBookComponent implements OnInit{

  protected locations: any;
  book: any;
  image: any;
  imageUrl: any;
  year: number[] = [];
  currentYear = new Date().getFullYear();
  maxAuthors = 3;
  editForm: FormGroup;
  values = [''];
  submit = false;

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
      accession: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      title: ['', [Validators.required, Validators.maxLength(255)]],
      authors: ['dump', Validators.required],
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

  closepopup(text: string) {
    this.ref.close(text);
  }

  sourceOfFundEvent(event: Event) {
    let type = (event.target as HTMLSelectElement).value;

    if(type == 'Purchased') {
      this.editForm.get('price')?.enable();
    } else {
      this.editForm.get('price')?.disable();
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
        this.bookService.deleteRecord(this.data.accession).subscribe({
          next: (res: any) => {
            Swal.fire({
              title: "Archiving complete!",
              text: "Book has been successfully archived.",
              icon: "success",
              confirmButtonText: 'Close',
              confirmButtonColor: "#777777",
              scrollbarPadding: false,
            });
            this.closepopup('Archive')
          },
          error: (err: any) => {
            console.log(err)
            Swal.fire({
              title: "Archive Error!",
              text: "Please try again later.",
              icon: "error",
              confirmButtonText: 'Close',
              confirmButtonColor: "#777777",
              scrollbarPadding: false,
            });
          }
        })
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
          this.closepopup('');
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
  removeValue(i: any) {
    this.values.splice(i, 1);
  }

  addValue() {
    if (this.values.length < 5) {
      this.values.push('');
    }
  }

  updateValue(event: Event, i: number) {
    let input = event.target as HTMLInputElement;
    this.values[i] = input.value;
  }

  isMaxLimitReached(): boolean {
    return this.values.length >= 5;
  }
  
  trackByIndex(index: number): number {
    return index;
  }
  // ----- END OF AUTHORS ----- //

  imageUpload(event: Event): void {
    const input = event.target as HTMLInputElement;

    // Check if there are files selected
    if (input.files && input.files.length) {
      const file = input.files[0];  // Get the first selected file

      // Check if the selected file is an image
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();  // Create a new FileReader instance

        // Define the onload callback for the FileReader
        reader.onload = () => this.imageUrl = reader.result; 

        reader.readAsDataURL(file);  // Read the file as a data URL

        this.image = file;

      } else {
        input.value = ''; // removes the file
        Swal.fire({
          title: 'File Error',
          text: "Invalid File! Only files with extensions .png, .jpg, .jpeg are allowed.",
          icon: 'error',
          confirmButtonText: 'Close',
          confirmButtonColor: "#777777",
          scrollbarPadding: false,
          willOpen: () => {
            document.body.style.overflowY = 'scroll';
          },
          willClose: () => {
            document.body.style.overflowY = 'scroll';
          }
        });
      }
    } 
  }

  isInvalid(controlName: string): boolean {
    const control = this.editForm.get(controlName);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  invalidAuthor(i: number) {
    let authorInput = this.values[i];

    return (authorInput.length < 1 || authorInput.length > 50) && this.submit;
  }
  
  validateAuthors() {
    let valid = true;
    let isNull = false;
    let isExceeded = false;

    for(let i = 0; i < this.values.length; i++) {
      if(!this.values[i]) valid = false, isNull = true;

      if(this.values[i].length > 50) valid = false, isExceeded = true;
    }
  
    return {'valid': valid, 'null': isNull, 'maxLength': isExceeded};
  }

  protected updateBook() {

    this.submit = true;

    if(this.editForm.valid && this.validateAuthors().valid) {
      
      this.editForm.patchValue({
        authors: JSON.stringify(this.values)
      });

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
          this.successMessage('Book');
          this.closepopup('Update');
        },
        error: (err: any) => this.serverErrors()
      });
    } else {
      this.markFormGroupTouched(this.editForm);
      this.displayErrors();
    }
  }

  successMessage(title:string) {
    Swal.fire({
      title: 'Success',
      text: title + " has been updated successfully",
      icon: 'success',
      confirmButtonText: 'Close',
      confirmButtonColor: "#777777",
      scrollbarPadding: false,
      willOpen: () => {
        document.body.style.overflowY = 'scroll';
      },
      willClose: () => {
        document.body.style.overflowY = 'scroll';
      }
    });
  }

  serverErrors() {
    Swal.fire({
      title: 'Oops! Server Side Error!',
      text: 'Please try again later or contact the developers',
      icon: 'error',
      confirmButtonText: 'Close',
      confirmButtonColor: "#777777",
      scrollbarPadding: false,
      willOpen: () => {
        document.body.style.overflowY = 'scroll';
      },
      willClose: () => {
        document.body.style.overflowY = 'scroll';
      }
    });
  }

  displayErrors() {

    let maxLengthFields = '';
    let minIntFields = '';
    let integerFields = '';
    let required = false;

    Object.keys(this.editForm.controls).forEach(key => {
      const control = this.editForm.get(key);
      if (control && control.errors) {
        const controlErrors = control.errors;
        Object.keys(controlErrors).forEach(errorKey => {
          switch (errorKey) {
            case 'required':
              required = true;
              break;

            case 'maxlength':
              maxLengthFields += `${key}, `;
              break;

            case 'min':
              minIntFields += `${key}, `;
              break;

            case 'pattern':
              if(controlErrors['pattern']['requiredPattern'] == '^[0-9]+$') {
                integerFields += `${key}, `;
              }
              break;

            default:
              break;
          }
        });
      }
    });

    if(this.validateAuthors().null) required = true;

    if(this.validateAuthors().maxLength) maxLengthFields += 'authors, ';

    let errorText = '';
    
    if(required) {
      errorText += 'Please fill up required fields <br>'
    } 
    
    if(maxLengthFields.length > 0) {
      errorText += 'Exceeds max length: ' + maxLengthFields.substring(0, maxLengthFields.length - 2) + '<br>';
    }

    if(minIntFields.length > 0) {
      errorText += 'Lower than minimum: ' + minIntFields.substring(0, minIntFields.length - 2) + '<br>';
    }

    if(integerFields.length > 0) {
      errorText += 'Should be number type: ' + integerFields.substring(0, integerFields.length - 2) + '<br>';
    }

    Swal.fire({
      title: 'Oops! Invalid Form!',
      html: `<div style="font-weight: 500;">${errorText}</div>`,
      icon: 'error',
      confirmButtonText: 'Close',
      confirmButtonColor: "#777777",
      scrollbarPadding: false,
      willOpen: () => {
        document.body.style.overflowY = 'scroll';
      },
      willClose: () => {
        document.body.style.overflowY = 'scroll';
      }
    });
  }

  isFieldFilled(fieldName: string): boolean {
    const control = this.editForm.get(fieldName);
    return !!control && control.value !== null && control.value !== '';
  }
}