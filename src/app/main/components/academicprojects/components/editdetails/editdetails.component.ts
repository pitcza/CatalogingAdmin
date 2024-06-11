import { ChangeDetectionStrategy, Component, OnInit, forwardRef,  Input, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import Swal from 'sweetalert2';
import { DataService } from '../../../../../services/data.service';

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
  values = [''];
  tags = [''];

  constructor(
    private router: Router, 
    private ref: MatDialogRef<EditdetailsComponent>, 
    private buildr: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ds: DataService,
    private cd: ChangeDetectorRef, // for keywords
  ) {
    if(data.details.authors != null) {
      this.values.splice(0, 1);
      data.details.authors.forEach((author: any) => {
        this.values.push(author)
      });
    }

    if(data.details.keywords) {
      this.tags.splice(0, 1);
        data.details.keywords.forEach((keyword: any) => {
          this.tags.push(keyword)
      }); 
    }
  }

  ngAfterViewInit(): void {
    this.cd.detectChanges();
  }

  ngOnInit() {
    this.ds.get('programs').subscribe({
      next: (res: any) => {
        this.programs = res;
        this.departmentFilter = res[0].department.department;
        this.programFilter = res[0].program;
        this.programCategory = res[0].category;

        // Extract unique department names from programs
        const uniqueDepartments = new Set<string>();
        this.programs.forEach((program: any) => {
            uniqueDepartments.add(program.department.department);
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

    console.log(selectDepartment)

    this.programs.some((x: any) => {
      if(x.department.department == this.departmentFilter) {
        this.programCategory = x.category;
        this.programFilter = x.id;
        return true; 
      }
      return false; 
    });

    this.changeCategory();
  }

  changedProgram(event: Event) {
    const selectProgram = (document.getElementById('filter-pro') as HTMLSelectElement).value;
    this.programFilter = selectProgram;

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

  // UPDATE POPUP
  protected updateBox() {
    var form = document.getElementById('edit-form') as HTMLFormElement;

      // Get the form elements
    const elements = form.elements;

    let formData = new FormData();
    let authorElements: any[] = [];
    let keywords: any[] = [];

    // Loop through each form element
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i] as HTMLInputElement;

      // Check if the element is an input field
      if ((element.tagName === 'INPUT' || element.tagName === 'SELECT' || element.tagName === 'DATE'
      || element.tagName === 'TEXTAREA') && element.id != 'submit-button') {

        if(element.name == 'program_id') {
          formData.append(element.name, '1');
        } else if (element.type === 'file' && element.files && element.files.length > 0) {
          formData.append(element.name, element.files[0]);
        } else if (element.name === 'author') {
          authorElements.push(element.value)
        } else if (element.name === 'keywords') {
          keywords.push(element.value)
        } else {
          formData.append(element.name, element.value)
        }

      }
    }
    
    formData.append('authors', JSON.stringify(authorElements));
    formData.append('keywords', JSON.stringify(keywords))
    formData.append('_method', 'PUT');
    this.ds.post('projects/process/' + this.data.details.id, formData).subscribe({
      next: (res: any) => {
        console.log(res)
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
    });
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