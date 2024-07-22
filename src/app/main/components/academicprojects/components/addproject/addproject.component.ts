import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild, forwardRef } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { text } from 'stream/consumers';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { DataService } from '../../../../../services/data/data.service';

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
    accession: ['', Validators.required],
    category: [{value: '', disabled: true}, Validators.required],
    title: ['', [Validators.required, Validators.maxLength(255)]],
    authors: ['', Validators.required],
    program: ['', Validators.required],
    image_url: [''],
    date_published: ['', Validators.required],
    language: ['English', Validators.required],
    abstract: [''],
    keywords: ['']
  });

  titleTooLong: boolean = false;  
  checkTitleLength() {
    const titleControl = this.form.get('title');
    if (titleControl) {
      this.titleTooLong = titleControl.value.length > 255;
    }
  }

  // // check if the field is filled (to move up label)
  // isFieldFilled(fieldName: string, index?: number): boolean {
  //   if (fieldName === 'author' && index !== undefined) {
  //     return this.values[index] !== null && this.values[index] !== '';
  //   } else {
  //     const control = this.form.get(fieldName);
  //     return !!control && control.value !== null && control.value !== '';
  //   }
  // }

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
  }

  // ----- MULTIPLE AUTHORS FUNCTION -----//
  values = [''];

  removevalue(i: any){
    this.values.splice(i, 1);
  }

  addvalue(){
    if (this.values.length < 6) {
      this.values.push('');
    }
    console.log(this.values)
  }

  updateValue(event: Event, i: number) {
    let input = event.target as HTMLInputElement;
    this.values[i] = input.value;
    console.log(this.values)
  }
  
  isMaxLimitReached(): boolean {
    return this.values.length >= 6;
  }

  authors: string[] = ['']; // Initialize with an empty author

  addAuthor() {
    this.authors = [...this.authors, '']; // Create a new array with the updated values
  }

  removeAuthor(index: number) {
    this.authors.splice(index, 1);
    this.authors = [...this.authors]; // Create a new array with the updated values
  }

  // Track by function to minimize re-renders
  trackByIndex(index: number, item: any): number {
    return index;
  }

  // TAGS KEYWORDS
  tags: string[] = [];
  @Input() placeholder = 'Enter a keyword...';
  @Input() removable = true;
  @Input() maxTags = 5; // hindi ko alam kung ilan max

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

  updateTag($event: Event, index: number) {
    console.log($event)
  }

  onKeyDown(event: any, value: string): void {
    switch (event.keyCode) {
      case 13:

      case 188: {
        if (value && value.trim() !== '') {
          if (!this.tags.includes(value) && this.tags.length < this.maxTags) {
            // this.tags.push();
            this.tags = [...this.tags, value];
            this.triggerChange(); // call trigger method
            this.cd.detectChanges();
          }
          this.inputField.nativeElement.value = '';
          event.preventDefault();
        }
        break;
      }

      case 8: {
        if (!value && this.tags.length > 0) {
          this.tags.pop();
          this.tags = [...this.tags];
          this.triggerChange(); // call trigger method
        }
        break;
      }

      default:
        break;
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

  isInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  invalidMultiInput(type: string, i: number) {
    let input = '';
    if(type == 'author') input = this.values[i];
    else if(type == 'tags') input = this.tags[i];

    return (input.length < 1 || input.length > 50) && this.submit;
  }
  
  validateMultiInput(type: string) {
    let valid = true, isNull = false, isExceeded = false;
    let input: any;

    if(type == 'author') input = this.values;
    else if(type == 'tags') input = this.tags;

    for(let i = 0; i < input.length; i++) {
      if(!input[i]) valid = false, isNull = true;

      if(input[i].length > 50) valid = false, isExceeded = true;
    }
  
    return {'valid': valid, 'null': isNull, 'maxLength': isExceeded};
  }

  // UPDATE POPUP
  protected submitForm() {

    this.form.get('category')?.enable();

    if(this.form.valid && this.validateMultiInput('author').valid && this.validateMultiInput('tags').valid) {
      
      this.form.patchValue({
        authors: JSON.stringify(this.values),
        keywords: JSON.stringify(this.tags)
      });
      let form = new FormData();

      Object.entries(this.form.value).forEach(([key, value]: [string, any]) => {
        if(value != '' && value != null)
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
    } else {
      this.form.get('category')?.disable();
      this.markFormGroupTouched(this.form);
      this.displayErrors();
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

  displayErrors() {

    let maxLengthFields = '';
    let minIntFields = '';
    let integerFields = '';
    let required = false;

    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
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

    if(this.validateMultiInput('author').null || this.validateMultiInput('tags').null) required = true;

    if(this.validateMultiInput('author').maxLength) maxLengthFields += 'authors, ';

    if(this.validateMultiInput('tags').maxLength) maxLengthFields += 'keywords, ';

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