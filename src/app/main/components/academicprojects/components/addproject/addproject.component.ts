import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild, forwardRef } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { text } from 'stream/consumers';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { DataService } from '../../../../../services/data/data.service';
import { error } from 'console';
import { validateHeaderName } from 'http';
import { pastDateValidator } from '../../../../../utils/custom-validators';

@Component({
  selector: 'app-addproject',
  templateUrl: './addproject.component.html',
  styleUrl: './addproject.component.scss',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => AddprojectComponent),
    multi: true
  }],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AddprojectComponent implements OnInit {
  submit = false;
  programs: any;
  departments: any;
  departmentFilter = '';
  programFilter: any;
  programCategory: any;
  form: FormGroup = this.formBuilder.group({
    accession: ['', [Validators.required, Validators.maxLength(20)]],
    category: [{value: '', disabled: true}, Validators.required],
    title: ['', [Validators.required, Validators.maxLength(255)]],
    authors: this.formBuilder.array([
      this.formBuilder.group({ authorName: ['', [Validators.required, Validators.maxLength(40)]]})
    ]),
    program: ['', Validators.required],
    image_url: [''],
    date_published: ['', [Validators.required, pastDateValidator()]],
    language: ['English', Validators.required],
    abstract: ['', [Validators.required, Validators.maxLength(2048)]],
    keywords: ['']
  });

  titleTooLong: boolean = false;  
  checkTitleLength() {
    const titleControl = this.form.get('title');
    if (titleControl) {
      this.titleTooLong = titleControl.value.length > 255;
    }
  }

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private ds: DataService,
    private elementRef: ElementRef,
    private cd: ChangeDetectorRef, // for keywords
    private sanitizer: DomSanitizer // for img preview
  ) { }

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

  ngAfterViewInit(): void {
    this.cd.detectChanges();
  }

  ngOnInit() {
    this.ds.request('GET', 'programs', null).subscribe({
      next: (res: any) => {
        this.programs = res;
        this.departmentFilter = this.programs[0].department_short;
        this.programFilter = this.programs[0].program_short;
        this.programCategory = this.programs[0].category;

        this.form.patchValue({
          program: this.programFilter,
          category: this.programCategory
        })

        // Extract unique department names from programs
        const uniqueDepartments = new Set<string>();
        this.programs.forEach((program: any) => {
            uniqueDepartments.add(program.department_short);
        });

        // Convert the Set back to an array
        this.departments = Array.from(uniqueDepartments);

        // Manually trigger change detection after setting values
        this.cd.detectChanges();
      }
    });

    this.form.markAllAsTouched();
  }

  // ----- MULTIPLE AUTHORS FUNCTION -----//

  authorArray = this.form.get('authors') as FormArray;

  addAuthor() {
    const control = this.authorArray;
    control.push(this.formBuilder.group({
      authorName: ['', [Validators.required, Validators.maxLength(40)]]
    }));

    control.at(control.length - 1).get('authorName')?.markAsTouched();
  }

  removeAuthor(index: number) {
    this.authorArray.removeAt(index);
  }

  // END OF AUTHORS


  // TAGS KEYWORDS
  tags: string[] = [];
  @Input() placeholder = 'Enter a keyword...';
  @Input() removable = true;
  @Input() maxTags = 5; // hindi ko alam kung ilan max
  keyword = '';

  @ViewChild('inputField') inputField: any;

  onChange: Function = () => {};
  onTouched: Function = () => {};

  onChipBarClick(): void {
    this.inputField.nativeElement.focus();
    this.cd.detectChanges();
  }

  removeItem(index: number): void {
    this.tags.splice(index, 1);
    this.triggerChange(); // call trigger method
  }

  removeAll(): void {
    this.tags = [];
    this.triggerChange(); // call trigger method
  }

  onKeyDown(event: any, value: string): void {
    if(this.form.get('keywords')?.value.length > 20) {
      this.form.get('keywords')?.setValue(value.substring(0, 20));
      Swal.fire({
        toast: true,
        icon: 'error',
        title: 'lasjfasolifjsd',
        position: 'top-end',
        showConfirmButton: false,
        timer: 5000
      });
    } else {
      switch (event.keyCode) {
        case 13: 
          if (value && value.trim() !== '') {
            if (!this.tags.includes(value) && this.tags.length < this.maxTags) {
              this.tags = [...this.tags, value];
              this.triggerChange(); // call trigger method
              this.cd.detectChanges();
            }
            this.inputField.nativeElement.value = '';
            event.preventDefault();
          }
          break;

        case 188:
          break;
  
        case 8:
          if (!value && this.tags.length > 0) {
            this.tags.pop();
            this.tags = [...this.tags];
            this.triggerChange(); // call trigger method
          }
          break;
  
        default:
          break;
      }
    }
    
  }

  writeValue(value: any): void {
    this.tags = value;
    this.cd.markForCheck();
  }

  registerOnChange(fn: Function): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: Function): void {
    this.onTouched = fn;
  }

  triggerChange(): void {
    this.onChange(this.tags);
    this.cd.markForCheck();
  }

  isMaxTagsReached(): boolean {
    return this.tags.length >= this.maxTags;
  }

  getRemainingTags(): number {
    return this.maxTags - this.tags.length;
  }
  // END OF KEYWORDS  

  // PROGRAM FILTERING
  changedDepartment(event: Event) {
    this.departmentFilter = (event.target as HTMLSelectElement).value;

    this.programs.some((x: any) => {
      if(x.department_short == this.departmentFilter) {
        this.programCategory = x.category;
        this.programFilter = x.program_short;
        this.form.patchValue({
          program: this.programFilter,
          category: this.programCategory
        });
        return true; 
      }
      return false; 
    });
  }

  changedProgram(event: Event) {
    this.programFilter = (event.target as HTMLSelectElement).value;

    this.programs.some((x: any) => {
      if(x.program_short == this.programFilter) {
        this.programCategory = x.category;
        this.form.patchValue({
          category: this.programCategory
        });
        return true; 
      }
      return false; 
    });
  }

  changeCategory(){

    this.programs.some((x: any) => {
      if(x.id == this.programFilter) {
        this.programCategory = x.category;
        return true; 
      }
      return false; 
    });
  }

  // For red inputs
  isInvalid(controlName: string, index?: number): boolean {
    const control = index !== undefined 
      ? (this.authorArray.at(index) as FormGroup).get(controlName) 
      : this.form.get(controlName);
      
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  isNull(controlName: string, index?: number): boolean {
    const control = index !== undefined 
      ? (this.authorArray.at(index) as FormGroup).get(controlName) 
      : this.form.get(controlName);
      
      const value = control?.value;

      // Check if the value is null, undefined, or an empty string after trimming
      return value === null || value === undefined || value.trim() === '';
  }

  // To stop input/revert if invalid
  deleteIfInvalid(event: Event, controlName: string, index?: number) {
    const control = index !== undefined
      ? (this.authorArray.at(index) as FormGroup).get(controlName) 
      : this.form.get(controlName);
      
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

  // UPDATE POPUP
  protected submitForm() {

    this.form.get('category')?.enable();

    if(this.form.valid) {
      
      let form = new FormData();

      this.form.patchValue({
        keywords: JSON.stringify(this.tags)
      });

      let authors = [];
      for(let i = 0; i < (this.form.get('authors') as FormArray).length; i++) {
        authors.push(((this.form.get('authors') as FormArray).at(i) as FormGroup).get('authorName')?.value);
      }
      form.append('authors', JSON.stringify(authors));

      Object.entries(this.form.value).forEach(([key, value]: [string, any]) => {
        if(value != '' && value != null && key != 'authors')
          form.append(key, value);
      });

      if(this.image)
        form.append('image_url', this.image);

      this.ds.request('POST', 'projects/process', form).subscribe({
        next: (res: any) => {
          Swal.fire({
            title: "Success",
            text: "Project has been added successfully",
            icon: "success",
            confirmButtonColor: "#4F6F52",
            scrollbarPadding: false,
            willOpen: () => {
              document.body.style.overflowY = 'scroll';
            },
            willClose: () => {
              document.body.style.overflowY = 'scroll';
            },
            timer: 5000
          });
        },
        error:(err: any) => this.form.get('accession')?.setErrors({ serverError: err.accession })
      });
    }
  }

  successMessage(title: any) {
    Swal.fire({
      title: 'Success',
      text: title + " has been updated successfully",
      icon: 'success',
      confirmButtonText: 'Close',
      confirmButtonColor: "#4F6F52",
      scrollbarPadding: false,
      willOpen: () => {
        document.body.style.overflowY = 'scroll';
      },
      willClose: () => {
        document.body.style.overflowY = 'scroll';
      },
      timer: 5000
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

  // POP UP FUNCTION CONTENT
  showPopup: boolean = false;

  closePopup() {
    this.showPopup = this.showPopup;
  }

  cancelBox(){
    Swal.fire({
      title: "Are you sure you want to cancel?",
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
          this.router.navigate(['main/academicprojects/listofprojects']); 
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
            title: "Project not saved."
          });
      }
    });
  }

}