import { AfterViewInit, Component, ElementRef, OnInit, ViewChild   } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { DataService } from '../../../../../services/data.service';
import { filter } from 'rxjs';

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
  categories: any;

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

        
        const uniqueCategories = new Set<string>();
        this.programs.forEach((program: any) => {
            uniqueCategories.add(program.category);
        });

        // Convert the Set back to an array
        this.categories = Array.from(uniqueCategories);
      }
    })
    
    // DYNAMIC ADD MULTIPLE AUTHOR
    this.values = this.inputValues.map(input => ({ ...input }));

    this.submit();
  }

  inputValues: { value: string }[] = [{ value: "" }];
  values: { value: string }[] = [];

  removevalue(i: any){
    this.values.splice(i, 1);
  }

  addvalue(){
    if (this.inputValues.length <6) {
    // Add a new input value to the inputValues array
    this.inputValues.push({ value: "" });
    // Update the values array with the current input values
    this.values = this.inputValues.map(input => ({ ...input }));
    }
  }

  isMaxLimitReached(): boolean {
    return this.inputValues.length >= 6;
  }

  // PROGRAM FILTERING
  changedDepartment(event: Event) {
    const selectDepartment = (document.getElementById('filter-department') as HTMLSelectElement).value;
    this.departmentFilter = selectDepartment;

    const selectProgram = (document.getElementById('filter-program') as HTMLSelectElement).value;
    this.programFilter = selectProgram;

    this.changeCategory();
  }

  changedProgram(event: Event) {
    const selectProgram = (document.getElementById('filter-program') as HTMLSelectElement).value;
    this.programFilter = selectProgram;

    this.changeCategory();
  }

  changeCategory(){
    console.log(this.programFilter)
    let tempCategory: any;
    for(let x of this.programs) {
      if(x.program === this.programFilter) {
        tempCategory = x.category;
        break;
      }
    }

    let tempIndex: any;
    for(let i = 0; i < this.categories.length; i++) {
      if(this.categories[i] == tempCategory) {
        tempIndex = i;
        break;
      }
    }

    const selectCategory = document.getElementById('category') as HTMLSelectElement
    selectCategory.selectedIndex = tempIndex;
  }
  // KEYWORDS FUNCTION NA HINDI NAGF-FUNCTION
  // maxTags: number = 10;
  // tags: string[] = ["coding", "nepal"];

  // countTags() {
  //   let tagNumb = document.querySelector(".details span");
  //   if (tagNumb) {
  //     tagNumb.textContent = String(this.maxTags - this.tags.length);
  //   }
  // }

  // createTag() {
  //   let ul = document.querySelector("ul");
  //   if (ul) {
  //     ul.innerHTML = ''; // Clear existing content
  //     this.tags.slice().reverse().forEach(tag => {
  //       let liTag = `<li>${tag} <i class="uit uit-multiply" (click)="remove('${tag}')"></i></li>`;
  //       ul!.insertAdjacentHTML("afterbegin", liTag); // Use 'ul!' to assert non-null
  //     });
  //     this.countTags();
  //   } else {
  //     console.error("UL element not found");
  //   }
  // }

  // remove(tag: string) {
  //   let index = this.tags.indexOf(tag);
  //   this.tags = [...this.tags.slice(0, index), ...this.tags.slice(index + 1)];
  //   this.createTag();
  // }

  // addTag(e: any) {
  //   if (e.key == "Enter") {
  //     let tag = e.target.value.replace(/\s+/g, ' ');
  //     if (tag.length > 1 && !this.tags.includes(tag)) {
  //       if (this.tags.length < this.maxTags) {
  //         tag.split(',').forEach((tag: string) => {
  //           this.tags.push(tag);
  //           this.createTag();
  //         });
  //       }
  //     }
  //     e.target.value = "";
  //   }
  // }

  // removeAll() {
  //   this.tags.length = 0;
  //   let ul = document.querySelector("ul");
  //   if (ul) {
  //     ul.querySelectorAll("li").forEach(li => li.remove());
  //   }
  //   this.countTags();
  // }


  /* SUBMIT FORM */
  submit() {
    var form = document.getElementById('project-form') as HTMLFormElement;

    form.addEventListener('submit', (event) => {

      // Prevent the default form submission behavior
      event.preventDefault();
  
      // Get the form elements
      const elements = form.elements;

      let formData = new FormData();
  
      // Loop through each form element
      for (let i = 0; i < elements.length; i++) {
          var element = elements[i] as HTMLInputElement;
        
          // Check if the element is an input field
          if (element.type === 'file' && element.files && element.files.length > 0) {
            formData.append(element.name, element.files[0]);
          } else if ((element.tagName === 'INPUT' || element.tagName === 'SELECT' || element.tagName === 'DATE'
          || element.tagName === 'TEXTAREA') && element.id != 'submit-button' && element.id != 'author') {
            formData.append(element.name, element.value);
            console.log(element.name + ': ' + element.value)
          } else if (element.id == 'author') {
              formData.append('authors', JSON.stringify(this.values)); 
          }
      }

      console.log(formData.get('category'))
      this.ds.post('projects/process', formData).subscribe({
        next: (res: any) => console.log(res)
      })

    }); // end of event listener

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