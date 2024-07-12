import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild, forwardRef } from '@angular/core';
import { Router } from '@angular/router';
import { Validators, FormBuilder, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import Swal from 'sweetalert2';
import { text } from 'stream/consumers';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { DataService } from '../../../../../services/data.service';
import { ProjectService } from '../../../../../services/materials/project/project.service';

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

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private ds: DataService,
    private projectService: ProjectService,
    private elementRef: ElementRef,
    private cd: ChangeDetectorRef,
    private sanitizer: DomSanitizer
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
  // END OF PREVIEW AND CROP IMAGE //

  ngAfterViewInit(): void {
    this.cd.detectChanges();
  }

  ngOnInit() {
    this.projectService.getPrograms().subscribe({
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
  // END OF MULTIPLE AUTHORS //

  // ----- TAGS KEYWORDS ----- //
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
  // END OF KEYWORDS //

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

  // check if the field is filled (to move up label)
  isFieldFilled(fieldName: string, index?: number): boolean {
    if (fieldName === 'author' && index !== undefined) {
      return this.values[index] !== null && this.values[index] !== '';
    } else {
      const control = this.form.get(fieldName);
      return !!control && control.value !== null && control.value !== '';
    }
  }

  isInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  // SUBMIT PROCESS
  protected submit() {

    this.form.get('category')?.enable();
    this.form.patchValue({
      authors: JSON.stringify(this.values),
      keywords: JSON.stringify(this.tags)
    });

    if(this.form.valid) {
      let form = new FormData();

      Object.entries(this.form.value).forEach(([key, value]: [string, any]) => {
        if(value != '' && value != null)
          form.append(key, value);
      });

      if(this.image)
        form.append('image_url', this.image);

      // add confirmation
      Swal.fire({
        title: "Are you sure you want to add a new project?",
        text: "This action will create a new project.",
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
          this.projectService.addRecord(form).subscribe({
            next: (res: any) => {
              this.router.navigate(['main/academicprojects/listofprojects']); // redirect to list project
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
            error:(err: any) => {
              console.log(err);
              Swal.fire({
                title: 'Error',
                text: "Oops a server error occured",
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
          });
        }
      })
    } else {
      Swal.fire({
        title: 'Error',
        text: "Oops an error occured",
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