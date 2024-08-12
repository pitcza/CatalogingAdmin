import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators, ValidationErrors, FormArray } from '@angular/forms';
import { ImportComponent } from './import/import.component';

import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { DataService } from '../../../services/data/data.service';
import { numberAndGreaterThanValidator, pastDateValidator } from '../../../utils/custom-validators';

@Component({
  selector: 'app-addmaterials',
  templateUrl: './addmaterials.component.html',
  styleUrls: ['./addmaterials.component.scss']
})
export class AddmaterialsComponent implements OnInit {

  bookSubmit = false; periodicalSubmit = false; articleSubmit = false; aVSubmit = false;
  bookForm: FormGroup;
  periodicalForm: FormGroup; articleForm: FormGroup;
  currentYear = new Date().getFullYear();
  year: number[] = [];

  bookImage: any = null;
  periodicalImage: any = null;
  AVImage: any = null;
  bookImageUrl: string | ArrayBuffer | null = null;  // Add this line
  periodicalImageUrl: string | ArrayBuffer | null = null;  // Add this line
  AVImageUrl: string | ArrayBuffer | null = null;  // Add this line
  isModalOpen: boolean = false;
  dialogRef: MatDialog;
  audioForm: FormGroup = this.formBuilder.group({
    accession: ['', [Validators.required, Validators.maxLength(20)]],
    title: ['', [Validators.required, Validators.maxLength(150)]],
    authors: this.formBuilder.array([
      this.formBuilder.group({ authorName: ['', [Validators.required, Validators.maxLength(40)]]})
    ]),
    call_number: ['', [Validators.required, Validators.maxLength(20)]],
    copyright: [this.currentYear, Validators.required],
  });

  constructor(
    private formBuilder: FormBuilder,
    private ds: DataService,
    private dialog: MatDialog,
    private cd: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {
    this.dialogRef = dialog;
    for (let i = 1991; i <= this.currentYear; i++) { this.year.push(i); }

    let sharedFields = {
      accession: ['', [Validators.required, Validators.maxLength(20)]],
      title: ['', [Validators.required, Validators.maxLength(150)]],
      publisher: ['', [Validators.required, Validators.maxLength(100)]],
      remarks: ['', Validators.maxLength(255)],
    };

    this.bookForm = this.formBuilder.group({
      ...sharedFields,
      authors: this.formBuilder.array([
        this.formBuilder.group({ authorName: ['', [Validators.required, Validators.maxLength(40)]]})
      ]),
      copyright: [this.currentYear, Validators.required],
      volume: ['', Validators.maxLength(50)],
      edition: ['', Validators.maxLength(50)],
      pages: ['', [Validators.required, numberAndGreaterThanValidator(0)]],
      acquired_date: ['', [Validators.required, pastDateValidator()]],
      source_of_fund: ['Purchased', Validators.required],
      price: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      location: ['ABCOMM', Validators.required],
      call_number: ['', [Validators.required, Validators.maxLength(20)]],
      author_number: ['', [Validators.required, Validators.maxLength(20)]],
      copies: [1, [Validators.required, numberAndGreaterThanValidator(0)]]
    });
    
    this.bookForm.get('accession')?.addValidators(Validators.pattern('^[0-9]+$'));
    this.bookForm.updateValueAndValidity();

    this.periodicalForm = this.formBuilder.group({
      ...sharedFields,
      authors: this.formBuilder.array([
        this.formBuilder.group({ authorName: ['', [Validators.required, Validators.maxLength(40)]]})
      ]),
      periodical_type: ['0', Validators.required],
      volume: ['', [Validators.required, Validators.maxLength(50)]],
      issue: ['', [Validators.required, Validators.maxLength(50)]],
      language: ['English', Validators.required],
      pages: ['', [Validators.required, numberAndGreaterThanValidator(0)]],
      acquired_date: ['', [Validators.required, pastDateValidator()]],
      date_published: ['', [Validators.required, pastDateValidator()]],
      copyright: [this.currentYear, Validators.required]
    });

    this.articleForm = this.formBuilder.group({
      ...sharedFields,
      authors: this.formBuilder.array([
        this.formBuilder.group({ authorName: ['', [Validators.required, Validators.maxLength(40)]]})
      ]),
      periodical_type: ['0', Validators.required],
      abstract: ['', [Validators.required, Validators.maxLength(4096)]],
      volume: ['', [Validators.required, Validators.maxLength(50)]],
      issue: ['', [Validators.required, Validators.maxLength(50)]],
      language: ['English', Validators.required],
      pages: ['', [Validators.required, Validators.maxLength(20)]],
      subject: ['', [Validators.required, Validators.maxLength(255)]],
      date_published: ['', [Validators.required, pastDateValidator()]]
    });
  }

  // form select initializers
  protected locations: any = null;

  ngOnInit(): void {
    this.getLocations();
    this.bookForm.markAllAsTouched();
    this.periodicalForm.markAllAsTouched();
    this.articleForm.markAllAsTouched();
    this.audioForm.markAllAsTouched();
  }

  protected getLocations() {
    this.ds.request('GET', 'books/locations', null).subscribe((res: any) => {
      this.locations = res;
    });
  }
  
  // ----- PREVIEW AND CROP IMAGE ----- //
  validBookImage = false; validPeriodicalImage = false; validAVImage = false;
  bookImgChangeEvt: any = ''; periodicalImgChangeEvt: any = ''; AVImgChangeEvt: any = '';
  bookCropImagePreview: SafeUrl | undefined; periodicalCropImagePreview: SafeUrl | undefined; AVCropImagePreview: SafeUrl | undefined;

  onFileChange(event: any, type: string) {
    const input = event.target;

    // Check if there are files selected
    if (input.files && input.files.length) {
      const file = input.files[0];  // Get the first selected file

      // Check if the selected file is an image
      if (file.type.startsWith('image/')) {
        if(type == 'book') { this.validBookImage = true; this.bookImgChangeEvt = event; this.bookCropImagePreview = ''; }
        else if(type == 'periodical') { this.validPeriodicalImage = true; this.periodicalImgChangeEvt = event; this.periodicalCropImagePreview = ''; }
        else if(type == 'AV') { this.validAVImage = true; this.AVImgChangeEvt = event; this.AVCropImagePreview = ''; }

        this.cd.detectChanges();
      } else {
        input.value = ''; // removes the file
        Swal.fire({
          toast: true,
          icon: 'error',
          title: "Invalid File! Only files with extensions .png, .jpg, .jpeg are allowed.",
          position: 'top-end',
          showConfirmButton: false,
          timer: 5000
        });
      }
    } 
  }

  cropImg(event: ImageCroppedEvent, type: string) {
    if (event?.objectUrl) {
      if (type == 'book') { this.bookCropImagePreview = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl); }
      else if (type == 'periodical') { this.periodicalCropImagePreview = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl); }
      else if (type == 'AV') { this.AVCropImagePreview = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl); }
      
      this.cd.detectChanges();
      
      this.getBlobFromObjectUrl(event.objectUrl).then((blob: Blob) => {
        if (blob) {

          if(type == 'book') {
            this.bookImage = blob;
          } else if (type == 'periodical') {
            this.periodicalImage = blob;
          } else if (type == 'AV') {
            this.AVImage = blob;
          }
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
      toast: true,
      icon: 'error',
      title: 'Image failed to show',
      position: 'top-end',
      showConfirmButton: false,
      timer: 5000
    });
  }
  // END OF PREVIEW AND CROP IMAGE //

  // MULTIPLE AUTHORS FUNCTION     

  getAuthorsArray(type: string) {
    switch(type) {
      case 'book':
        return this.bookForm.get('authors') as FormArray;

      case 'periodical':
        return this.periodicalForm.get('authors') as FormArray;

      case 'article':
        return this.articleForm.get('authors') as FormArray;

      case 'AV':
        return this.audioForm.get('authors') as FormArray;

      default: // default is book form to avoid errors
        return this.bookForm.get('authors') as FormArray;
    }
  }

  addAuthor(type: string) {
    const control = this.getAuthorsArray(type);
    control.push(this.formBuilder.group({
      authorName: ['', [Validators.required, Validators.maxLength(40)]]
    }));

    control.at(control.length - 1).get('authorName')?.markAsTouched();
  }

  removeAuthor(type: string, index: number) {
    this.getAuthorsArray(type).removeAt(index);
  }

  // END OF AUTHORS

  /* enable price if book is purchased, disable otherwise */
  changedFunds(event: Event) {
    let price = (event?.target as HTMLInputElement).value;
    let priceControl = this.bookForm.get('price');
    if(price == 'Purchased'){
      priceControl?.enable();
      priceControl?.addValidators([Validators.required, Validators.min(1)]);
    } else {
      priceControl?.disable();
      priceControl?.clearValidators();
    }
    priceControl?.updateValueAndValidity();
  }

  getFormSet(type: string) {
    let dummyForm: FormGroup = this.formBuilder.group({
      key: ['']
    });

    switch(type) {
      case 'book':
        return this.bookForm;

      case 'periodical':
        return this.periodicalForm;

      case 'article':
        return this.articleForm;
      
      case 'AV':
        return this.audioForm;

      default:
        return dummyForm;
    }
  }

  // For red inputs
  isInvalid(controlName: string, type: string, index?: number): boolean {
    const control = index !== undefined 
      ? (this.getAuthorsArray(type).at(index) as FormGroup).get(controlName) 
      : this.getFormSet(type).get(controlName);
      
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  isNull(controlName: string, type: string, index?: number): boolean {
    const control = index !== undefined 
      ? (this.getAuthorsArray(type).at(index) as FormGroup).get(controlName) 
      :  this.getFormSet(type).get(controlName);
      
      const value = control?.value;

      // Check if the value is null, undefined, or an empty string after trimming
      return (value === null || value === undefined || value.trim() === '') && (control?.invalid || false);
  }

  // To stop input/revert if invalid
  deleteIfInvalid(event: Event, controlName: string, type: string, index?: number) {
    const control = index !== undefined
      ? (this.getAuthorsArray(type).at(index) as FormGroup).get(controlName) 
      : this.getFormSet(type).get(controlName);
      
    if(control) {
      const errors = control.errors;
      let text = '';
      if (errors) {
        if (errors['maxlength']) {
          control.setValue(((event.target as HTMLInputElement).value).substring(0, errors['maxlength'].requiredLength));
          text += 'Max ' + errors['maxlength'].requiredLength + ' characters reached! ';
        } if (errors['pattern']) {
          if(errors['pattern'].requiredPattern == '/^\\d+(\\.\\d{1,2})?$/') {
            control.setValue('');
            text += 'Only numbers up to 2 decimal places are allowed!';
          } else if(errors['pattern'].requiredPattern == '^[0-9]+$') {
            const numericValue = (event.target as HTMLInputElement).value.replace(/\D/g, '');
            control.setValue(numericValue);
            text += 'Only numbers are allowed! ';
          }
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

  protected materialSubmit(type: string) {

    let addForm = this.getFormSet(type);

    switch(type) {
      case 'book':
        this.bookSubmit = true;
        break;

      case 'periodical':
        this.periodicalSubmit = true;
        break;

      case 'article':
        this.articleSubmit = true;
        break;

      case 'AV':
        this.aVSubmit = true;
        break;
    }

    if(addForm.valid) {
      Swal.fire({
        title: "Are you sure you want to add a new material?",
        text: "This action will create a new " + type + ".",
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

        // pass datas to formdata to allow sending of files
        let form = new FormData();

        Object.entries(addForm.value).forEach(([key, value]: [string, any]) => {
          if(key == 'authors') {
            let authors = [];
            for(let i = 0; i < (addForm.get('authors') as FormArray).length; i++) {
              authors.push(((addForm.get('authors') as FormArray).at(i) as FormGroup).get('authorName')?.value);
            }
            form.append('authors', JSON.stringify(authors));
          }

          else if(value != '' && value != null)
            form.append(key, value);
        });

        if(type == 'book') {
          if(this.bookImage) {
            form.append('image_url', this.bookImage);
          }
        } else if(type == 'periodical') {
          if(this.periodicalImage) {
            form.append('image_url', this.periodicalImage);
          }
        } else if(type == 'AV') {
          if(this.AVImage) {
            form.append('image_url', this.AVImage);
          }
        }

        let formTitle = '';
        formTitle += form.get('title');

        if(type == 'book') {
          this.ds.request('POST', 'materials/books/process', form).subscribe({
            next: (res: any) => {
              this.successMessage(formTitle)
              }
          });
        } else if(type == 'periodical') {
          this.ds.request('POST', 'materials/periodicals/process', form).subscribe({
            next: (res: any) => {
              this.successMessage(formTitle)
              }
          });
        } else if(type == 'article') {
          this.ds.request('POST', 'materials/articles/process', form).subscribe({
            next: (res: any) => {
              this.successMessage(formTitle)
              }
          });
        } else if(type == 'AV') {
          this.ds.request('POST', 'materials/audio-visuals/process', form).subscribe({
            next: (res: any) => {
              this.successMessage(formTitle)
              }
          });
        } 
      }
    });
    }
  }

  successMessage(title:string) {
    Swal.fire({
      title: 'Success',
      text: title + " has been added successfully",
      icon: 'success',
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

  serverErrors(err: string) {
    if(err.toLowerCase().includes('sqlstate[23000]')) var text = 'Duplicate accession number.'
    else var text = 'Unknown error.'
    Swal.fire({
      title: 'Oops! Error adding material!',
      text: text,
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
  
  importmaterialBtnClick() {
    if(this.isModalOpen) {
      return
    }
    
    this.isModalOpen = true

    let modal = this.dialogRef.open(ImportComponent, {});
    modal.afterClosed().subscribe(
      (      result: { success: any; }) => {
        this.isModalOpen = false

      }
    )
  }

}

