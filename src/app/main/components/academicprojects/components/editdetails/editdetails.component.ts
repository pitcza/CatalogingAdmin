import { ChangeDetectionStrategy, Component, OnInit, forwardRef,  Input, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import Swal from 'sweetalert2';
import { DataService } from '../../../../../services/data.service';
import { ProjectService } from '../../../../../services/materials/project/project.service';

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
  
  programs: any;
  departments: any;
  departmentFilter = '';
  programFilter: any;
  programCategory: any;
  project: any;
  values = [''];
  tags = [''];
  image: any;
  projectImage: any;
  editForm: FormGroup = this.formBuilder.group({
    accession: ['', Validators.required],
    category: [{value: '', disabled: true}, Validators.required],
    title: ['', [Validators.required, Validators.maxLength(255)]],
    authors: ['', Validators.required],
    program: ['', Validators.required],
    image_url: [''],
    date_published: ['', Validators.required],
    language: [2024, Validators.required],
    abstract: [''],
    keywords: ['']
  });

  constructor(
    private router: Router, 
    private ref: MatDialogRef<EditdetailsComponent>, 
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private projectService: ProjectService,
    private cd: ChangeDetectorRef, // for keywords
  ) { }

  ngAfterViewInit(): void {
    this.cd.detectChanges();
  }

  ngOnInit() {
    this.projectService.getRecord(this.data.details).subscribe((res: any) => {
      this.project = res;

      if(this.project.authors != null) {
        this.values.splice(0, 1);
        this.project.authors.forEach((author: any) => {
          this.values.push(author)
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
        authors: this.project.authors,
        program: this.project.program,
        date_published: this.project.date_published,
        language: this.project.language,
        abstract: this.project.abstract,
        keywords: this.project.keywords
      });
    });

    this.projectService.getPrograms().subscribe({
      next: (res: any) => {
        this.programs = res;
        this.departmentFilter = this.project.project_program.department_short;
        this.programFilter = this.project.program_short;
        this.programCategory = this.project.category;

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

  // PROGRAM FILTERING
  changedDepartment(event: Event) {
    const selectDepartment = (document.getElementById("filter-dept") as HTMLSelectElement).value;
    this.departmentFilter = selectDepartment;

    this.programs.some((x: any) => {
      if(x.department_short == this.departmentFilter) {
        this.programCategory = x.category;
        this.programFilter = x.program_short;
        return true; 
      }
      return false; 
    });

    this.changeCategory();
  }

  changedProgram(event: Event) {
    const selectProgram = (document.getElementById('filter-pro') as HTMLSelectElement).value;
    this.programFilter = selectProgram;
    console.log(selectProgram)

    this.changeCategory();
  }

  changeCategory(){
    this.programs.some((x: any) => {
      if(x.id == this.programFilter) {
        this.programCategory = x.category;
        console.log(x.program, this.programCategory)
        return true; 
      }
      return false; 
    });
  }

  // Track by function to minimize re-renders
  trackByIndex(index: number, item: any): number {
    return index;
  }

  removeAuthor(event: Event) {
    let targetElement = event.target;

    // Get the author div
    let element = ((targetElement as HTMLElement).parentNode)?.parentNode;
    element?.parentNode?.removeChild(element);
  }

  removevalue(i: any){
    this.values.splice(i, 1);
  }

  addvalue(){
    if (this.values.length < 6) {
      this.values.push('');
    }
  }

  updateValue($event: Event, index: number) {
    // this.values[index] = $event.target.value;
    console.log($event)
  }

  isMaxLimitReached(): boolean {
    return this.values.length >= 6;
  }

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
    console.log($event)
  }

  onKeyDown(event: any, value: string): void {
    switch (event.keyCode) {
      case 13:

      case 188: {
        if (value && value.trim() !== '') {
          if (!this.tags.includes(value) && this.tags.length < this.maxTags) {
            // this.items.push();
            this.tags = [...this.tags, value];
            this.triggerChange(); // call trigger method
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
  }

  isMaxTagsReached(): boolean {
    return this.tags.length >= this.maxTags;
  }
  // END OF KEYWORDS

  closepopup() {
    this.ref.close('Closed using function');
  }

  addImage(event: Event) {
    const input = event.target as HTMLInputElement;

    // Check if there are files selected
    if (input.files && input.files.length) {
      const file = input.files[0];  // Get the first selected file

      // Check if the selected file is an image
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();  // Create a new FileReader instance

        // Define the onload callback for the FileReader
        reader.onload = () => {
          this.projectImage = reader.result;  // Set the image property to the result
        };

        reader.readAsDataURL(file);  // Read the file as a data URL

        this.image = file;  // Optionally store the file object itself

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

  // UPDATE POPUP
  protected update() {
    console.log(this.image)

    this.editForm.get('category')?.enable();
    this.editForm.patchValue({
      authors: JSON.stringify(this.values),
      keywords: JSON.stringify(this.tags)
    });

    if(this.editForm.valid) {
      let form = new FormData();

      Object.entries(this.editForm.value).forEach(([key, value]: [string, any]) => {
        if(value != '' && value != null)
          form.append(key, value);
      });

      if(this.image)
        form.append('image_url', this.image);

      this.projectService.updateRecord(this.data.details, form).subscribe({
        next: (res: any) => {
          Swal.fire({
            title: "Update successful!",
            text: "The changes have been saved.",
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
          this.ref.close('Changed Data');
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

  // ARCHIVE POPUP
  archiveBox(){
    Swal.fire({
      title: "Archive Project",
      text: "Are you sure want to archive this project?",
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
        this.ref.close('Closed using function');
        Swal.fire({
          title: "Archiving complete!",
          text: "Project has been safely archived.",
          icon: "success",
          confirmButtonText: 'Close',
          confirmButtonColor: "#777777",
          scrollbarPadding: false,
        });
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
}