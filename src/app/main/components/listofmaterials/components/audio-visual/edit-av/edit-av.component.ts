import { Component, NgZoneOptions, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DataService } from '../../../../../../services/data/data.service';

@Component({
  selector: 'app-edit-av',
  templateUrl: './edit-av.component.html',
  styleUrl: './edit-av.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
})
export class EditAVComponent implements OnInit {
  year: number[] = [];
  values = [''];
  currentYear = new Date().getFullYear();
  submit = false;
  editForm: FormGroup = this.formBuilder.group({
    accession: ['', [Validators.required, Validators.maxLength(20)]],
    title: ['', [Validators.required, Validators.maxLength(150)]],
    authors: ['', [Validators.required, Validators.maxLength(255)]],
    call_number: ['', [Validators.required, Validators.maxLength(20)]],
    copyright: [2024, Validators.required],
  });

  constructor(
    private ref: MatDialogRef<EditAVComponent>, 
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private router: Router,
    private ds: DataService
  ) { 

    for(let i = 1991; i <= this.currentYear; i++) {
      this.year.push(i);
    }
  }

  ngOnInit(): void {
    this.ds.request('GET', 'material/id/' + this.data.accession, null).subscribe((res: any) => {
      this.editForm.patchValue({
        accession: res.accession,
        title: res.title,
        authors: res.authors,
        call_number: res.call_number,
        copyright: res.copyright
      });

      this.values = res.authors;
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

  // RED INPUT FIELD
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

  closepopup(text: string) {
    this.ref.close(text);
  }

  // ARCHIVE POPUP
  archiveBox(){
    Swal.fire({
      title: "Archive Audio-Visual",
      text: "Are you sure you want to archive this audio-visual?",
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
        this.ds.request('DELETE', 'materials/archive/' + this.data.accession, null).subscribe({
          next: (res: any) => {
            Swal.fire({
              title: "Archiving complete!",
              text: "Audio-visual has been successfully archived.",
              icon: "success",
              confirmButtonText: 'Close',
              confirmButtonColor: "#777777",
              scrollbarPadding: false,
            });
            this.closepopup('Archive')
          },
          error: (err: any) => {
            if(err.message.toLowerCase().includes('no query results for model')) var text = 'Cannot find material';
            else var text = 'Uknown error';

            Swal.fire({
              title: "Oops! Archive Error!",
              text: text,
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

  // UPDATE DETAILS
  protected updateAV() {
    Swal.fire({
      title: "Update Audio-Visual",
      text: "Are you sure you want to update the audio-visual details?",
      icon: "question",
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
      if (result.isConfirmed) {
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
    
          this.ds.request('PUT', 'materials/audio-visuals/process/' + this.data.accession, form).subscribe({
            next: (res: any) => { this.successMessage('Audio-visual'); this.closepopup('Update'); },
            error: (err: any) => this.editForm.get('accession')?.setErrors({ serverError: err.accession })
          });
        } else {
          this.markFormGroupTouched(this.editForm);
          this.displayErrors();
        }
      }
    });
  }

  successMessage(title: any) {
    Swal.fire({
      title: 'Success',
      text: title + " has been updated successfully",
      icon: 'success',
      confirmButtonText: 'Close',
      confirmButtonColor: "#777777",
    });
  }

  serverErrors() {
    Swal.fire({
      title: 'Oops! Server Side Error!',
      text: 'Please try again later or contact the developers',
      icon: 'error',
      confirmButtonText: 'Close',
      confirmButtonColor: "#777777",
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
    });
  }
}
