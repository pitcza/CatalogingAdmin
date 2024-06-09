import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild, forwardRef } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { DataService } from '../../../../../services/data.service';
import { text } from 'stream/consumers';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

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

  constructor(
    private router: Router,
    private ds: DataService,
    private cd: ChangeDetectorRef, // for keywords
  ) { }

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
    })
    this.submit();
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
  @Input() maxTags = 15; // hindi ko alam kung ilan max

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
  // END OF KEYWORDS

  // PROGRAM FILTERING
  changedDepartment(event: Event) {
    const selectDepartment = (document.getElementById('filter-department') as HTMLSelectElement).value;
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
    const selectProgram = (document.getElementById('filter-program') as HTMLSelectElement).value;
    this.programFilter = selectProgram;

    this.changeCategory();
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

  /* SUBMIT FORM */
  submit() {
    var form = document.getElementById('project-form') as HTMLFormElement;

    form.addEventListener('submit', (event) => {

      // Prevent the default form submission behavior
      event.preventDefault();
  
      // Get the form elements
      const elements = form.elements;

      let formData = new FormData();

      let fields = ['program_id', 'category', 'title', 'author', 'language', 'date_published', 'abstract', 'keywords'];
      let valid = true;
      let validFile = true;
      let authorElements: any[] = [];
      let keywords: any[] = [];
  
      // Loop through each form element
      for (let i = 0; i < elements.length; i++) {
          var element = elements[i] as HTMLInputElement;
        
          // Check if the element is an input field
          if (element.type === 'file' && element.files && element.files.length > 0) {
            const file = element.files[0];
            if(file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png') {
              formData.append(element.name, element.files[0]);
            } else {
              validFile = false;
            }
          } else if (element.name == 'author') {
            authorElements.push(element.value.trim())
          } else if (element.name == 'keywords') {
            keywords.push(element.value.trim())
          } else if ((element.tagName === 'INPUT' || element.tagName === 'SELECT' || element.tagName === 'DATE'
          || element.tagName === 'TEXTAREA') && element.id != 'submit-button') {
            formData.append(element.name, element.value);
          } 
          if(fields.includes(element.name) && element.value == '') {
            valid = false;
            element.style.borderColor = 'red';
          } else 
              element.style.borderColor = 'black';
      }

      formData.append('authors', JSON.stringify(authorElements));

      // let keywords = ['drama', 'action', 'awesome']
      formData.append('keywords', JSON.stringify(keywords));
      console.log(formData.get('keywords'));
      console.log(formData.get('authors'));


      if(valid && validFile) {
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
          if (result.isConfirmed) {
            this.ds.post('projects/process', formData).subscribe({
              next: (res: any) => {
                this.router.navigate(['main/academicprojects/listofprojects']); // redirect to list kapag nag add
                console.log(res)
                Swal.fire({
                  title: 'Success',
                  text: formData.get('title') + " has been added successfully",
                  icon: 'success',
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
            })
          } else if(!validFile) {
            Swal.fire({
              title: 'Oops! Error on form',
              text: 'Invalid image. Must be of type png, jpeg, or jpg.',
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
          } else {
            Swal.fire({
              title: 'Oops! Error on form',
              text: 'Please check if required fields have values',
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