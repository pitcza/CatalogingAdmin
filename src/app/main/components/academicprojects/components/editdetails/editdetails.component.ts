import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import Swal from 'sweetalert2';
import { DataService } from '../../../../../services/data.service';

interface MyOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-editdetails',
  templateUrl: './editdetails.component.html',
  styleUrl: './editdetails.component.scss'
})
export class EditdetailsComponent implements OnInit{

  programs: any;
  departments: any;
  departmentFilter = '';
  programFilter: any;
  programCategory: any;
  values = [''];

  constructor(
    private router: Router, 
    private ref: MatDialogRef<EditdetailsComponent>, 
    private buildr: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ds: DataService
  ) { 
    this.values.splice(0, 1);
    data.details.authors.forEach((author: any) => {
      this.values.push(author.name)
    });
  }

  ngOnInit() {
    console.log(this.data.details)
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
    });
  }

  // PROGRAM FILTERING
  changedDepartment(event: Event) {
    const selectDepartment = (document.getElementById("filter-dept") as HTMLSelectElement).value;
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


  // ADD AUTHOR FUNCTION AND STYLE
  addAuthor() {    
    let input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.classList.add('inputtxt');
    input.setAttribute('style', 'font-family: Montserrat; width: 100%; padding-top: 19px; padding-left: 10px; padding-right: 10px; height: 60px; font-size: 15px; border: none; background-color: var(--input); border-top-left-radius: 5px; border-top-right-radius: 5px; outline: none;  border-bottom: 2px solid var(--input-border);');
    input.setAttribute('onmouseover', 'this.style.backgroundColor= "var(--input-hover)"');
    input.setAttribute('onmouseout', 'this.style.backgroundColor= "var(--input)"');

    // if the input field is focused
    input.addEventListener('focus', function() {
      input.style.borderBottom = '2.5px solid var(--main-green)';
      labelline.style.color = 'var(--main-green)';
    });

    input.addEventListener('blur', function() {
      // if the input field is not focused
      if (document.activeElement !== input) {
          input.style.borderBottom = '2px solid var(--input-border)';
          labelline.style.color = 'var(--input-border)';
      }
    });
    
    let i = document.createElement('i');
    i.classList.add('bx', 'bx-x', 'removebtn');

    // remove button
    let remove = document.createElement('button');
    remove.classList.add('removebtn');
    remove.setAttribute('type', 'button');
    remove.setAttribute('style', 'font-family: Montserrat; font-weight: 600; font-size: 35px; letter-spacing: 0.5px; margin-top: 1.3rem; height: 60px; width: 70px; background-color: var(--cancel-btn); color: var(--secondary-color); outline: none; border: none; border-radius: 5px; padding-top: 3px;')
    remove.appendChild(i);

    // author label
    let labelline = document.createElement('label');
    labelline.classList.add('labelline');
    labelline.textContent = 'Author';
    labelline.setAttribute('style', 'position: absolute; top: 7px; left: 10px; font-size: 12px; color: var(--input-border); letter-spacing: 0.5px;');

    let author = document.createElement('div');
    author.classList.add('txt_field');
    author.setAttribute('style', 'flex-basis: 100%; position: relative; margin: 1.3rem 0;')
    author.appendChild(input);
    author.appendChild(labelline);

    let row = document.createElement('div');
    row.classList.add('input-row');
    row.setAttribute('style', 'gap: 1.5rem; display: flex; justify-content: space-between;')
    row.appendChild(author);
    row.appendChild(remove);

    let parent = document.getElementById('author-inputs');
    parent?.appendChild(row);
    
    remove.addEventListener('click', function() {
      parent?.removeChild(row);
    })
  }
  // END OF ADD AUTHOR FUNCTION AND STYLE

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
    console.log(this.values)
  }

  updateValue($event: Event, index: number) {
    // this.values[index] = $event.target.value;
    console.log($event)
  }

  isMaxLimitReached(): boolean {
    return this.values.length >= 6;
  }

  closepopup() {
    this.ref.close('Closed using function');
  }

  // SWEETALERT UPDATE POPUP
  protected updateBox() {
    var form = document.getElementById('edit-form') as HTMLFormElement;

      // Get the form elements
    const elements = form.elements;

    let formData = new FormData();
    let authorElements: any[] = [];

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
        } else {
          formData.append(element.name, element.value)
        }

      }
    }
    
    formData.append('authors', JSON.stringify(authorElements));
    formData.append('_method', 'PUT');
    this.ds.post('projects/process/' + this.data.details.id, formData).subscribe({
      next: (res: any) => {
        console.log(res)
        Swal.fire({
          title: "Update successful!",
          text: "The changes have been saved.",
          icon: "success"
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
        });
      }
    });
  }

  // SWEETALERT ARCHIVE POPUP
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
    }).then((result) => {
      if (result.isConfirmed) {
        this.ref.close('Closed using function');
        Swal.fire({
          title: "Archiving complete!",
          text: "Project has been safely archived.",
          icon: "success",
          confirmButtonText: 'Close',
          confirmButtonColor: "#777777",
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
    }).then((result) => {
      if (result.isConfirmed) {
          this.ref.close('Closed using function');
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
            title: "Changes not saved."
          });
      }
    });
  }
}