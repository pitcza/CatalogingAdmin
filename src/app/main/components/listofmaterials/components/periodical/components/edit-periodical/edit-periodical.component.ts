import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { DataService } from '../../../../../../../services/data/data.service';

@Component({
  selector: 'app-edit-periodical',
  templateUrl: './edit-periodical.component.html',
  styleUrl: './edit-periodical.component.scss'
})

export class EditPeriodicalComponent implements OnInit{
  
  year: number[] = [];
  currentYear = new Date().getFullYear();
  periodical: any;
  editForm: FormGroup;
  imageUrl: any;
  submit = false;

  constructor(private ref: MatDialogRef<EditPeriodicalComponent>, 
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    private cd: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private ds: DataService
  ) {

    for(let i = 1991; i <= this.currentYear; i++) {
      this.year.push(i);
    }

    this.editForm = formBuilder.group({
      accession: ['', Validators.required],
      title: ['', [Validators.required, Validators.maxLength(255)]],
      authors: ['', Validators.required],
      publisher: ['', Validators.required],
      remarks: [''],
      pages: ['', Validators.required],
      periodical_type: ['0', Validators.required],
      volume: ['', Validators.required],
      issue: ['', Validators.required],
      language: ['English', Validators.required],
      acquired_date: ['', Validators.required],
      date_published: ['', Validators.required],
      copyright: [2024, Validators.required]
    });
   }

  ngOnInit(): void {
    console.log(this.data.details)
    this.ds.request('GET', 'material/id/' + this.data.details, null).subscribe((res: any) => {
      this.periodical = res;
      this.values = this.periodical.authors;

      this.editForm.patchValue({
        accession: this.periodical.accession,
        title: this.periodical.title,
        publisher: this.periodical.publisher,
        authors: this.periodical.authors,
        remarks: this.periodical.remarks,
        pages: this.periodical.pages,
        periodical_type: this.periodical.periodical_type,
        volume: this.periodical.volume,
        issue: this.periodical.issue,
        language: this.periodical.language,
        acquired_date: this.periodical.acquired_date,
        date_published: this.periodical.date_published,
        copyright: this.periodical.copyright
      });
    })
  }
   
  closepopup(text: string) {
    this.ref.close(text);
  }

  // ARCHIVE POPUP
  archiveBox(){
    Swal.fire({
      title: "Archive Periodical",
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
        this.ds.request('DELETE', 'materials/archive/' + this.periodical.accession, null).subscribe({
          next: (res: any) => {
            Swal.fire({
              title: "Archiving complete!",
              text: "Journal has been successfully archived.",
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
      },
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

  // ----- PREVIEW AND CROP IMAGE ----- //
  validFile = false;
  imgChangeEvt: any = null;
  cropImagePreview: SafeUrl | undefined;
  image: any;

  onFileChange(event: any) {
    const input = event.target as HTMLInputElement;

    // Check if there are files selected
    if (input.files && input.files.length) {
      const file = input.files[0];  // Get the first selected file

      // Check if the selected file is an image
      if (file.type.startsWith('image/')) {
        this.validFile = true;
        this.imgChangeEvt = event;
        this.image = file;  // Optionally store the file object itself

        // Reset cropImagePreview when a new file is selected
        this.cropImagePreview = undefined;
        this.cd.detectChanges();
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

  cropImg(event: ImageCroppedEvent) {
    if (event?.objectUrl) {
      this.cropImagePreview = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl);
      this.cd.detectChanges();
      
      this.getBlobFromObjectUrl(event.objectUrl).then((blob: Blob) => {
        if (blob) {
          this.image = blob;
        }
      }).catch(error => {
        console.error('Error:', error);
      });
    }
  }

  async getBlobFromObjectUrl(objectUrl: string): Promise<Blob> {
    try {
      const response = await fetch(objectUrl);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const blob = await response.blob();
      return blob;
    } catch (error) {
      console.error('Error fetching or converting to Blob:', error);
      throw error;
    }
  }

  imgLoad() {
    this.cd.detectChanges();
  }

  initCropper() {
    this.cd.detectChanges();
  }

  imgFailed() {
    Swal.fire({
      title: 'Error',
      text: "Image failed to show. Please try again.",
      icon: 'error',
      confirmButtonText: 'Close',
      confirmButtonColor: "#777777",
      timer: 2500,
      scrollbarPadding: false,
      willOpen: () => {
        document.body.style.overflowY = 'scroll';
      },
      willClose: () => {
        document.body.style.overflowY = 'scroll';
      }
    });
  }
  // END OF PREVIEW AND CROP IMAGE //

  // ----- AUTHORS ----- //
  values = [''];

  // Track by function to minimize re-renders
  trackByIndex(index: number, item: any): number {
    return index;
  }

  removevalue(i: any){
    this.values.splice(i, 1);
  }

  addvalue(){
    if (this.values.length < 5) {
      this.values.push('');
    }
  }

  updateValue($event: Event, index: number) {
    this.values[index] = ($event.target as HTMLInputElement).value;
  }

  isMaxLimitReached(): boolean {
    return this.values.length >= 5;
  }
  // ----- END OF AUTHORS ----- //

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

  isFieldFilled(fieldName: string): boolean {
    const control = this.editForm.get(fieldName);
    return !!control && control.value !== null && control.value !== '';
  }
  
  protected updateBox() {

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

      Swal.fire({
        title: "Update Periodical",
        text: "Are you sure you want to update the periodical details?",
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
        if(result.isConfirmed) {
          this.ds.request('PUT', 'materials/process/' + this.data.details, form).subscribe({
            next: (res: any) => {
              this.successMessage(form.get('title'));
              this.closepopup('Update');
            },
            error: (err: any) => this.serverErrors()
          });
        }
      })
    } else {
      this.markFormGroupTouched(this.editForm);
      this.displayErrors();
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
          console.log(key)
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
}
