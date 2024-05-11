import { AfterViewInit, Component, ElementRef, OnInit, ViewChild   } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { DataService } from '../../../../../services/data.service';
import { text } from 'stream/consumers';

interface MyOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-addproject',
  templateUrl: './addproject.component.html',
  styleUrl: './addproject.component.scss'
})

export class AddprojectComponent implements OnInit{

  programs: any;
  departments: any;
  departmentFilter = '';
  programFilter: any;
  programCategory: any;

  constructor(private router: Router,
    private elementRef: ElementRef,
    private ds: DataService
  ) { }

  ngOnInit() {
    this.ds.get('programs').subscribe({
      next: (res: any) => {
        this.programs = res;
        this.departmentFilter = res[0].department;
        this.programFilter = res[0].program;
        this.programCategory = res[0].category;

        // Extract unique department names from programs
        const uniqueDepartments = new Set<string>();
        this.programs.forEach((program: any) => {
            uniqueDepartments.add(program.department);
        });

        // Convert the Set back to an array
        this.departments = Array.from(uniqueDepartments);
      }
    })
    this.submit();
  }

  values = [''];


  // ADD AUTHOR FUNCTION AND STYLE
  // addAuthor() {    
  //   let input = document.createElement('input');
  //   input.setAttribute('type', 'text');
  //   input.classList.add('inputtxt');
  //   input.setAttribute('style', 'font-family: Montserrat; width: 100%; padding-top: 19px; padding-left: 10px; padding-right: 10px; height: 60px; font-size: 15px; border: none; background-color: var(--input); border-top-left-radius: 5px; border-top-right-radius: 5px; outline: none;  border-bottom: 2px solid var(--input-border);');
  //   input.setAttribute('onmouseover', 'this.style.backgroundColor= "var(--input-hover)"');
  //   input.setAttribute('onmouseout', 'this.style.backgroundColor= "var(--input)"');

  //   // if the input field is focused
  //   input.addEventListener('focus', function() {
  //     input.style.borderBottom = '2.5px solid var(--main-green)';
  //     labelline.style.color = 'var(--main-green)';
  //   });

  //   input.addEventListener('blur', function() {
  //     // if the input field is not focused
  //     if (document.activeElement !== input) {
  //         input.style.borderBottom = '2px solid var(--input-border)';
  //         labelline.style.color = 'var(--input-border)';
  //     }
  //   });
    
  //   let i = document.createElement('i');
  //   i.classList.add('bx', 'bx-x', 'removebtn');

  //   // remove button
  //   let remove = document.createElement('button');
  //   remove.classList.add('removebtn');
  //   remove.setAttribute('type', 'button');
  //   remove.setAttribute('style', 'font-family: Montserrat; font-weight: 600; font-size: 35px; letter-spacing: 0.5px; margin-top: 1.3rem; height: 60px; width: 70px; background-color: var(--cancel-btn); color: var(--secondary-color); outline: none; border: none; border-radius: 5px; padding-top: 3px;')
  //   remove.appendChild(i);

  //   // author label
  //   let labelline = document.createElement('label');
  //   labelline.classList.add('labelline');
  //   labelline.textContent = 'Author';
  //   labelline.setAttribute('style', 'position: absolute; top: 7px; left: 10px; font-size: 12px; color: var(--input-border); letter-spacing: 0.5px;');

  //   let author = document.createElement('div');
  //   author.classList.add('txt_field');
  //   author.setAttribute('style', 'flex-basis: 100%; position: relative; margin: 1.3rem 0;')
  //   author.appendChild(input);
  //   author.appendChild(labelline);

  //   let row = document.createElement('div');
  //   row.classList.add('input-row');
  //   row.setAttribute('style', 'gap: 1.5rem; display: flex; justify-content: space-between;')
  //   row.appendChild(author);
  //   row.appendChild(remove);

  //   let parent = document.getElementById('author-inputs');
  //   parent?.appendChild(row);
    
  //   remove.addEventListener('click', function() {
  //     parent?.removeChild(row);
  //   })

  // }

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
  // END OF ADD AUTHOR FUNCTION AND STYLE

  // PROGRAM FILTERING
  changedDepartment(event: Event) {
    const selectDepartment = (document.getElementById('filter-department') as HTMLSelectElement).value;
    this.departmentFilter = selectDepartment;
    console.log(selectDepartment)
    
    this.programs.some((x: any) => {
      if(x.department == this.departmentFilter) {
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

  // KEYWORDS FUNCTION NA HINDI NAGF-FUNCTION
  // tags: string[] = [];

  // createTag() {
  //   let ul = document.querySelector("ul");
  //   if (ul) {
  //     ul.innerHTML = ''; // Clear existing content
  //     this.tags.slice().reverse().forEach(tag => {
  //       let liTag = `<li style='color: #333;
  //       margin: 4px 3px;
  //       list-style: none;
  //       border-radius: 5px;
  //       background: #F2F2F2;
  //       padding: 5px 8px 5px 10px;
  //       border: 1px solid #e3e1e1;'> ${tag} <i class="bx bx-x removekeyw" (click)="remove(tag)" style='height: 20px;
  //       width: 20px;
  //       color: #808080;
  //       margin-left: 8px;
  //       font-size: 12px;
  //       cursor: pointer;
  //       border-radius: 50%;
  //       background: #dfdfdf;
  //       justify-content: center;'></i> </li>`;
  //       ul!.insertAdjacentHTML("afterbegin", liTag); // Use 'ul!' to assert non-null

  //     });
  //   } else {
  //     console.error("UL element not found");
  //   }
  // }

  // remove(tagToRemove: string) {
  //   this.tags = this.tags.filter(tag => tag !== tagToRemove);
  // }

  // addTag(e: any) {
  //   if (e.key == "Shift") {
  //     let tag = e.target.value.replace(/\s+/g, '');
  //     if (tag.length > 1 && !this.tags.includes(tag)) {
  //       tag.split(',').forEach((tag: string) => {
  //         this.tags.push(tag);
  //         this.createTag();
  //       });
  //     }
  //     e.target.value = "";
  //   }
  // }

  //   removeAll() {
  //     this.tags.length = 0;
  //     let ul = document.querySelector("ul");
  //     if (ul) {
  //       ul.querySelectorAll("li").forEach(li => li.remove());
  //     }
  //   }

  tagInput: string = '';
  tags: string[] = [];

  addTag(e: any) {
    if (e.key == ",") {
    if (this.tagInput.trim() !== '') {
      this.tags.push(this.tagInput.trim());
      this.tagInput = ''; // Clear the input field after adding the tag
    }
  } }

  removeTag(tagToRemove: string) {
    this.tags = this.tags.filter(tag => tag !== tagToRemove);
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

      let fields = ['program_id', 'category', 'title', 'author', 'language', 'date_published', 'abstract'];
      let valid = true;
      let validFile = true;
      let authorElements: any[] = [];
  
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
            console.log(element.value)
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

      if(valid && validFile) {
        this.ds.post('projects/process', formData).subscribe({
          next: (res: any) => {
            console.log(res)
            Swal.fire({
              title: 'Success',
              text: formData.get('title') + " has been added successfully",
              icon: 'success',
              confirmButtonText: 'Close',
              confirmButtonColor: "#777777",
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
        });
      } else {
        Swal.fire({
          title: 'Oops! Error on form',
          text: 'Please check if required fields have values',
          icon: 'error',
          confirmButtonText: 'Close',
          confirmButtonColor: "#777777",
        });
      }
    });

  }

  // POP UP FUNCTION CONTENT
  showPopup: boolean = false;

  closePopup() {
    this.showPopup = this.showPopup;
  }

  addBox() {
    this.router.navigate(['main/academicprojects/listofprojects']); 
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });
    Toast.fire({
      icon: "success",
      title: "Project Successfully Added."
    });
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