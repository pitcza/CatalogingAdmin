import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import Swal from 'sweetalert2';
import { DataService } from '../../../../../../../services/data/data.service';

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

  constructor(private ref: MatDialogRef<EditArticleComponent>, 
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private ds: DataService
  ) { 
    this.editForm = formBuilder.group({
      accession: ['', [Validators.required, Validators.maxLength(20)]],
      title: ['', [Validators.maxLength(255)]],
      authors: this.formBuilder.array([
        // this.formBuilder.group({ authorName: ['', [Validators.required, Validators.maxLength(40)]]})
      ]),
      publisher: ['', Validators.maxLength(100)],
      remarks: ['', Validators.maxLength(255)],
      pages: ['', [Validators.required, Validators.maxLength(20)]],
      periodical_type: ['0', Validators.required],
      abstract: ['', [Validators.required, Validators.maxLength(4096)]],
      volume: ['', [Validators.maxLength(50)]],
      issue: ['', [Validators.maxLength(50)]],
      language: ['English', Validators.required],
      subject: ['', [Validators.required, Validators.maxLength(255)]],
      date_published: ['', Validators.required]
    });
  }

  article: any;
  image: any;
  editForm: FormGroup;
  submit = false;

  ngOnInit(): void {
    this.ds.request('GET', 'material/id/' + this.data.details, null).subscribe((res: any) => {
      this.article = res;
      if(this.article.authors != null) {
        this.article.authors.forEach((author: any) => {
          this.addAuthor(author)
        });
      }

      this.editForm.patchValue({
        accession: this.article.accession,
        title: this.article.title,
        publisher: this.article.publisher,
        remarks: this.article.remarks,
        pages: this.article.pages,
        periodical_type: '' + this.article.periodical_type,
        abstract: this.article.abstract,
        volume: this.article.volume,
        issue: this.article.issue,
        language: this.article.language,
        subject: this.article.subject,
        date_published: this.article.date_published
      });
    })
  }

  closepopup(text: string) {
    this.ref.close(text);
  }

  // ARCHIVE POPUP
  archiveBox(){
    Swal.fire({
      title: "Archive Article",
      text: "Are you sure you want to archive this periodical?",
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
        this.ds.request('DELETE', 'materials/archive/' + this.article.accession, null).subscribe({
          next: (res: any) => {
            Swal.fire({
              title: "Archiving complete!",
              text: "Article has been successfully archived.",
              icon: "success",
              confirmButtonText: 'Close',
              confirmButtonColor: "#777777",
              scrollbarPadding: false,
            });
            this.closepopup('Archive')
          },
          error: (err: any) => {
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
      },
    }).then((result) => {
      if (result.isConfirmed) {
          this.ref.close('');
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
  get getAuthorsArray() {
    return this.editForm.get('authors') as FormArray;
  }

  addAuthor(value?: string) {
    const control = this.getAuthorsArray;
    control.push(this.formBuilder.group({
      authorName: [value, [Validators.maxLength(40)]]
    }));

    control.at(control.length - 1).get('authorName')?.markAsTouched();
  }

  removeAuthor(index: number) {
    this.getAuthorsArray.removeAt(index);
  }

  // END OF AUTHORS
  
  /* For error catching */
  isInvalid(controlName: string, index?: number): boolean {
    const control = index !== undefined 
      ? (this.getAuthorsArray.at(index) as FormGroup).get(controlName) 
      : this.editForm.get(controlName);
      
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  isNull(controlName: string, index?: number): boolean {
    const control = index !== undefined 
      ? (this.getAuthorsArray.at(index) as FormGroup).get(controlName) 
      : this.editForm.get(controlName);
      
      const value = control?.value;

      // Check if the value is null, undefined, or an empty string after trimming
      return value === null || value === undefined || value === '';
  }

  // To stop input/revert if invalid
  deleteIfInvalid(event: Event, controlName: string, index?: number) {
    const control = index !== undefined
      ? (this.getAuthorsArray.at(index) as FormGroup).get(controlName) 
      : this.editForm.get(controlName);
      
    let today = new Date();
    if(control) {
      const errors = control.errors;
      let text = '';
      if (errors) {
        if (errors['maxlength']) {
          control.setValue(((event.target as HTMLInputElement).value).substring(0, errors['maxlength'].requiredLength));
          text += 'Max ' + errors['maxlength'].requiredLength + ' characters reached! ';
        } if (errors['pattern']) {
          const numericValue = (event.target as HTMLInputElement).value.replace(/\D/g, '');
          control.setValue(numericValue);
          text += 'Only numbers are allowed! ';
        } if(errors['greaterThan']) {
          control.setValue(1);
          text += 'Only numbers greater than ' + errors['greaterThan'].requiredValue + ' are allowed!';
        } if(errors['invalidDate']) {
          control.setValue('');
          text += 'Invalid date!'
        } if(errors['notPastDate']) {
          control.setValue('');
          text += 'Should be past date!';
        }
      }

      /* Handle the popup */
      if(text) {
        Swal.fire({
          toast: true,
          icon: 'error',
          title: text,
          position: 'top-end',
          showConfirmButton: false,
          timer: 5000
        });
      }
    }
  }

  protected updateBox() {

    if(this.editForm.valid) {
      
      // pass datas to formdata to allow sending of files
      let form = new FormData();
      const editAuthors = this.editForm.get('authors') as FormArray;

      let authors = [];
      for(let i = 0; i < editAuthors.length; i++) {
        if((editAuthors.at(i) as FormGroup).get('authorName')?.value)
        authors.push((editAuthors.at(i) as FormGroup).get('authorName')?.value);
      }
      form.append('authors', JSON.stringify(authors));

      Object.entries(this.editForm.value).forEach(([key, value]: [string, any]) => {
        if(key != 'authors')
          form.append(key, value);
      });

      Swal.fire({
        title: "Update Article",
        text: "Are you sure you want to update the article details?",
        icon: "question",
        reverseButtons: true,
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        confirmButtonColor: "#4F6F52",
        cancelButtonColor: "#777777",
        scrollbarPadding: false,
        willOpen: () => {
          document.body.style.overflowY = 'scroll';
        },
        willClose: () => {
          document.body.style.overflowY = 'scroll';
        }
      }).then((result) => {
        if(result.isConfirmed) {
          this.ds.request('PUT', 'materials/articles/process/' + this.data.details, form).subscribe({
            next: (res: any) => {
              this.successMessage(form.get('title') || 'Article');
              this.closepopup('Update');
            }
          });
        }
      })
    }
  }

  successMessage(title: any) {
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
}
