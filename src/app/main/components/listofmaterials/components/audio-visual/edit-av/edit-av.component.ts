import {
  ChangeDetectorRef,
  Component,
  NgZoneOptions,
  OnInit,
  Inject,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DataService } from '../../../../../../services/data/data.service';

@Component({
  selector: 'app-edit-av',
  templateUrl: './edit-av.component.html',
  styleUrl: './edit-av.component.scss',
})
export class EditAVComponent implements OnInit {
  year: number[] = [];
  values = [''];
  imageUrl: any;
  currentYear = new Date().getFullYear();
  submit = false;
  errorImage = 'assets/images/NoImage.png';

  editForm: FormGroup = this.formBuilder.group({
    accession: ['', [Validators.required, Validators.maxLength(20)]],
    title: ['', [Validators.maxLength(150)]],
    authors: this.formBuilder.array([
      // this.formBuilder.group({ authorName: ['', [Validators.required, Validators.maxLength(40)]]})
    ]),
    call_number: ['', [Validators.required, Validators.maxLength(20)]],
    copyright: [this.currentYear],
  });

  constructor(
    private ref: MatDialogRef<EditAVComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    private cd: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private ds: DataService
  ) {
    for (let i = 1991; i <= this.currentYear; i++) {
      this.year.push(i);
    }
  }

  ngOnInit(): void {
    this.ds
      .request('GET', 'material/id/' + this.data.accession, null)
      .subscribe((res: any) => {
        this.editForm.patchValue({
          accession: res.accession,
          title: res.title,
          call_number: res.call_number,
          copyright: res.copyright,
        });

        if (res.authors != null) {
          res.authors.forEach((author: any) => {
            this.addAuthor(author);
          });
        }
        this.cropImagePreview = res.image_url;
      });
  }

  // ----- AUTHORS ----- //
  get getAuthorsArray() {
    return this.editForm.get('authors') as FormArray;
  }

  addAuthor(value?: string) {
    const control = this.getAuthorsArray;
    control.push(
      this.formBuilder.group({
        authorName: [value, [Validators.maxLength(40)]],
      })
    );

    control
      .at(control.length - 1)
      .get('authorName')
      ?.markAsTouched();
  }

  removeAuthor(index: number) {
    this.getAuthorsArray.removeAt(index);
  }

  // END OF AUTHORS

  // ----- PREVIEW AND CROP IMAGE ----- //
  validFile = false;
  imgChangeEvt: any = null;
  cropImagePreview: SafeUrl | undefined;
  image: any;

  onFileChange(event: any) {
    const input = event.target as HTMLInputElement;

    // Check if there are files selected
    if (input.files && input.files.length) {
      const file = input.files[0]; // Get the first selected file

      // Check if the selected file is an image
      if (file.type.startsWith('image/')) {
        this.validFile = true;
        this.imgChangeEvt = event;
        this.image = file; // Optionally store the file object itself

        // Reset cropImagePreview when a new file is selected
        this.cropImagePreview = undefined;
        this.cd.detectChanges();
      } else {
        input.value = ''; // removes the file
        Swal.fire({
          toast: true,
          icon: 'error',
          title:
            'Invalid File! Only files with extensions .png, .jpg, .jpeg are allowed.',
          position: 'top-end',
          showConfirmButton: false,
          timer: 5000,
        });
      }
    }
  }

  cropImg(event: ImageCroppedEvent) {
    if (event?.objectUrl) {
      this.cropImagePreview = this.sanitizer.bypassSecurityTrustUrl(
        event.objectUrl
      );
      this.cd.detectChanges();

      this.getBlobFromObjectUrl(event.objectUrl)
        .then((blob: Blob) => {
          if (blob) {
            this.image = blob;
          }
        })
        .catch((error) => {
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
      text: 'Image failed to show. Please try again.',
      icon: 'error',
      confirmButtonText: 'Close',
      confirmButtonColor: '#777777',
      timer: 2500,
      scrollbarPadding: false,
      willOpen: () => {
        document.body.style.overflowY = 'scroll';
      },
      willClose: () => {
        document.body.style.overflowY = 'scroll';
      },
    });
  }
  // END OF PREVIEW AND CROP IMAGE //

  /* For error catching */
  isInvalid(controlName: string, index?: number): boolean {
    const control =
      index !== undefined
        ? (this.getAuthorsArray.at(index) as FormGroup).get(controlName)
        : this.editForm.get(controlName);

    return control
      ? control.invalid && (control.dirty || control.touched)
      : false;
  }

  isNull(controlName: string, index?: number): boolean {
    const control =
      index !== undefined
        ? (this.getAuthorsArray.at(index) as FormGroup).get(controlName)
        : this.editForm.get(controlName);

    const value = control?.value;

    // Check if the value is null, undefined, or an empty string after trimming
    return value === null || value === undefined || value === '';
  }

  // To stop input/revert if invalid
  deleteIfInvalid(event: Event, controlName: string, index?: number) {
    const control =
      index !== undefined
        ? (this.getAuthorsArray.at(index) as FormGroup).get(controlName)
        : this.editForm.get(controlName);

    let today = new Date();
    if (control) {
      const errors = control.errors;
      let text = '';
      if (errors) {
        if (errors['maxlength']) {
          control.setValue(
            (event.target as HTMLInputElement).value.substring(
              0,
              errors['maxlength'].requiredLength
            )
          );
          text +=
            'Max ' +
            errors['maxlength'].requiredLength +
            ' characters reached! ';
        }
        if (errors['pattern']) {
          const numericValue = (event.target as HTMLInputElement).value.replace(
            /\D/g,
            ''
          );
          control.setValue(numericValue);
          text += 'Only numbers are allowed! ';
        }
        if (errors['greaterThan']) {
          control.setValue(1);
          text +=
            'Only numbers greater than ' +
            errors['greaterThan'].requiredValue +
            ' are allowed!';
        }
        if (errors['invalidDate']) {
          control.setValue('');
          text += 'Invalid date!';
        }
        if (errors['notPastDate']) {
          control.setValue('');
          text += 'Should be past date!';
        }
      }

      /* Handle the popup */
      if (text) {
        Swal.fire({
          toast: true,
          icon: 'error',
          title: text,
          position: 'top-end',
          showConfirmButton: false,
          timer: 5000,
        });
      }
    }
  }

  closepopup(text: string) {
    this.ref.close(text);
  }

  // ARCHIVE POPUP
  archiveBox() {
    Swal.fire({
      title: 'Archive Audio-Visual',
      text: 'Are you sure you want to archive this audio-visual?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#AB0E0E',
      cancelButtonColor: '#777777',
      scrollbarPadding: false,
      willOpen: () => {
        document.body.style.overflowY = 'scroll';
      },
      willClose: () => {
        document.body.style.overflowY = 'scroll';
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.ds
          .request('DELETE', 'materials/archive/' + this.data.accession, null)
          .subscribe({
            next: (res: any) => {
              Swal.fire({
                title: 'Archiving complete!',
                text: 'Audio-visual has been successfully archived.',
                icon: 'success',
                confirmButtonText: 'Close',
                confirmButtonColor: '#777777',
                scrollbarPadding: false,
              });
              this.closepopup('Archive');
            },
            error: (err: any) => {
              if (
                err.message.toLowerCase().includes('no query results for model')
              )
                var text = 'Cannot find material';
              else var text = 'Unknown error';

              Swal.fire({
                title: 'Oops! Archive Error!',
                text: text,
                icon: 'error',
                confirmButtonText: 'Close',
                confirmButtonColor: '#777777',
                scrollbarPadding: false,
              });
            },
          });
      }
    });
  }

  // CANCEL EDITING POPUP
  cancelBox() {
    Swal.fire({
      title: 'Are you sure you want to cancel editing details?',
      text: 'Your changes will not be saved.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      confirmButtonColor: '#AB0E0E',
      cancelButtonColor: '#777777',
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
          position: 'top-end',
          showConfirmButton: false,
          timer: 2500,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });
        Toast.fire({
          icon: 'error',
          title: 'Changes not saved.',
        });
      }
    });
  }

  // UPDATE DETAILS
  protected updateAV() {
    Swal.fire({
      title: 'Update Audio-Visual',
      text: 'Are you sure you want to update the audio-visual details?',
      icon: 'question',
      reverseButtons: true,
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      confirmButtonColor: '#4F6F52',
      cancelButtonColor: '#777777',
      scrollbarPadding: false,
      willOpen: () => {
        document.body.style.overflowY = 'scroll';
      },
      willClose: () => {
        document.body.style.overflowY = 'scroll';
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.submit = true;
        if (this.editForm.valid) {
          // pass datas to formdata to allow sending of files
          let form = new FormData();

          Object.entries(this.editForm.value).forEach(
            ([key, value]: [string, any]) => {
              if (key == 'authors') {
                let authors = [];
                for (
                  let i = 0;
                  i < (this.editForm.get('authors') as FormArray).length;
                  i++
                ) {
                  authors.push(
                    (
                      (this.editForm.get('authors') as FormArray).at(
                        i
                      ) as FormGroup
                    ).get('authorName')?.value
                  );
                }
                form.append('authors', JSON.stringify(authors));
              } else if (value) form.append(key, value);
              else form.append(key, '');
            }
          );

          if (this.image) {
            form.append('image_url', this.image);
          }

          this.ds
            .request(
              'PUT',
              'materials/audio-visuals/process/' + this.data.accession,
              form
            )
            .subscribe({
              next: (res: any) => {
                this.successMessage('Audio-visual');
                this.closepopup('Update');
              },
              error: (err: any) =>
                this.editForm
                  .get('accession')
                  ?.setErrors({ serverError: err.accession }),
            });
        }
      }
    });
  }

  successMessage(title: any) {
    Swal.fire({
      title: 'Success',
      text: title + ' has been updated successfully',
      icon: 'success',
      confirmButtonText: 'Close',
      confirmButtonColor: '#777777',
    });
  }

  serverErrors() {
    Swal.fire({
      title: 'Oops! Server Side Error!',
      text: 'Please try again later or contact the developers',
      icon: 'error',
      confirmButtonText: 'Close',
      confirmButtonColor: '#777777',
    });
  }
}
