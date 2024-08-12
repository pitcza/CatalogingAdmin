import { ChangeDetectionStrategy, Component, OnInit, forwardRef,  Input, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NG_VALUE_ACCESSOR, FormArray } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Inject } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import Swal from 'sweetalert2';
import { DataService } from '../../../../../services/data/data.service';

@Component({
  selector: 'app-editdetails',
  templateUrl: './editdetails.component.html',
  styleUrl: './editdetails.component.scss',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => EditdetailsComponent),
    multi: true
  }],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class EditdetailsComponent implements OnInit{

  errorImage = '../../../../../../assets/images/NoImage.png';
  programs: any;
  departments: any;
  departmentFilter = '';
  programFilter: any;
  programCategory: any;
  project: any;
  values = [''];
  tags = [''];
  projectImage: any;
  submit = false;
  editForm: FormGroup = this.formBuilder.group({
    accession: ['', Validators.required],
    category: [{value: '', disabled: true}, Validators.required],
    title: ['', [Validators.required, Validators.maxLength(255)]],
    authors: this.formBuilder.array([
      // this.formBuilder.group({ authorName: ['', [Validators.required, Validators.maxLength(40)]]})
    ]),
    program: ['', Validators.required],
    image_url: [''],
    date_published: ['', Validators.required],
    language: ['English', Validators.required],
    abstract: ['', Validators.required],
    keywords: ['']
  });

  titleTooLong: boolean = false;  
  checkTitleLength() {
    const titleControl = this.editForm.get('title');
    if (titleControl) {
      this.titleTooLong = titleControl.value.length > 255;
    }
  }

  constructor(
    private router: Router, 
    private ref: MatDialogRef<EditdetailsComponent>, 
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ds: DataService,
    private cd: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) { }

  ngAfterViewInit(): void {
    this.cd.detectChanges();
  }

  ngOnInit() {
    this.ds.request('GET', 'project/id/' + this.data.details, null).subscribe((res: any) => {
      this.project = res;
      if(this.project.authors != null) {
        this.project.authors.forEach((author: any) => {
          this.addAuthor(author)
        });
      }

      if(this.project.keywords) {
        this.tags.splice(0, 1);
          this.project.keywords.forEach((keyword: any) => {
            this.tags.push(keyword)
        }); 
      }
      
      this.editForm.patchValue({
        accession: this.project.accession,
        category: this.project.category,
        title: this.project.title,
        program: this.project.program,
        date_published: this.project.date_published,
        language: this.project.language,
        abstract: this.project.abstract,
        keywords: ''
      });

      this.programFilter = this.project.program;
      this.programCategory = this.project.category;
      this.departmentFilter = this.project.project_program.department_short;

      this.cropImagePreview = this.project.image_url;
    });

    this.ds.request('GET', 'programs', null).subscribe({
      next: (res: any) => {
        this.programs = res;

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
          position: 'top-end',
          title: "Invalid File! Only files with extensions .png, .jpg, .jpeg are allowed.",
          icon: 'error',
          timerProgressBar: true,
          showConfirmButton: false,
          timer: 5000,
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

  // PROGRAM FILTERING
  changedDepartment(event: Event) {
    this.departmentFilter = (event.target as HTMLSelectElement).value;

    this.programs.some((x: any) => {
      if(x.department_short == this.departmentFilter) {
        this.programCategory = x.category;
        this.programFilter = x.program_short;
        this.editForm.patchValue({
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
        this.editForm.patchValue({
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

  // ----- MULTIPLE AUTHORS FUNCTION -----//

  authorArray = this.editForm.get('authors') as FormArray;

  addAuthor(value?: string) {
    const control = this.authorArray;
    control.push(this.formBuilder.group({
      authorName: [value, [Validators.required, Validators.maxLength(40)]]
    }));

    control.at(control.length - 1).get('authorName')?.markAsTouched();
  }

  removeAuthor(index: number) {
    this.authorArray.removeAt(index);
  }

  // END OF AUTHORS

  // TAGS KEYWORDS
  // tags: string[] = [];
  @Input() placeholder = 'Enter a keyword...';
  @Input() removable = true;
  @Input() maxTags = 5; // hindi ko alam kung ilan max

  @ViewChild('inputField') inputField: any;

  onChange: Function = () => {};
  onTouched: Function = () => {};

  onChipBarClick(): void {
    this.inputField.nativeElement.focus();
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
    // this.values[index] = $event.target.value;
  }

  onKeyDown(event: any, value: string): void {
    if(this.editForm.get('keywords')?.value.length > 20) {
      this.editForm.get('keywords')?.setValue(value.substring(0, 20));
      Swal.fire({
        toast: true,
        icon: 'error',
        title: 'Max 20 characters reacheds!',
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
  }

  isMaxTagsReached(): boolean {
    return this.tags.length >= this.maxTags;
  }
  // END OF KEYWORDS

  closepopup(text: string) {
    this.ref.close(text);
  }
  
  /* For error catching */
  isInvalid(controlName: string, index?: number): boolean {
    const control = index !== undefined 
      ? (this.authorArray.at(index) as FormGroup).get(controlName) 
      : this.editForm.get(controlName);
      
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  isNull(controlName: string, index?: number): boolean {
    const control = index !== undefined 
      ? (this.authorArray.at(index) as FormGroup).get(controlName) 
      : this.editForm.get(controlName);
      
      const value = control?.value;

      // Check if the value is null, undefined, or an empty string after trimming
      return value === null || value === undefined || value.trim() === '';
  }

  // To stop input/revert if invalid
  deleteIfInvalid(event: Event, controlName: string, index?: number) {
    const control = index !== undefined
      ? (this.authorArray.at(index) as FormGroup).get(controlName) 
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

  // ARCHIVE POPUP
  archiveBox(){
    Swal.fire({
      title: "Archive Project",
      text: "Are you sure you want to archive this project?",
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
        this.ds.request('DELETE', 'projects/archive/' + this.data.details, null).subscribe({
          next: (res: any) => {
            Swal.fire({
              title: "Archiving complete!",
              text: "Project has been successfully archived.",
              icon: "success",
              confirmButtonText: 'Close',
              confirmButtonColor: "#777777",
              scrollbarPadding: false,
            });
            this.closepopup('Archive')
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
          this.ref.close('Closed using function');
          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 2500,
            timerProgressBar: true,
            scrollbarPadding: false,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            }
          });
          Toast.fire({
            icon: "error",
            title: "Changes not saved.",
          });
      }
    });
  }

  // UPDATE POPUP
  protected update() {

    this.editForm.get('category')?.enable();

    if(this.editForm.valid) {
      let form = new FormData();

      let authors = [];
      for(let i = 0; i < (this.editForm.get('authors') as FormArray).length; i++) {
        authors.push(((this.editForm.get('authors') as FormArray).at(i) as FormGroup).get('authorName')?.value);
      }
      form.append('authors', JSON.stringify(authors));

      this.editForm.patchValue({
        keywords: JSON.stringify(this.tags)
      });

      Object.entries(this.editForm.value).forEach(([key, value]: [string, any]) => {
        if(value != '' && value != null && key != 'authors')
          form.append(key, value);
      });

      if(this.image)
        form.append('image_url', this.image);

      Swal.fire({
        title: "Update Project",
        text: "Are you sure you want to update the project details?",
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
          this.ds.request('PUT', 'projects/process/' + this.data.details, form).subscribe({
            next: (res: any) => { this.successMessage('Project'); this.closepopup('Update') },
            error: (err: any) => this.editForm.get('accession')?.setErrors({ serverError: err.accession })
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
}
