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
  options1 = [
    { value: 'CCS', label: 'CCS' },
    { value: 'CBA', label: 'CBA' },
    { value: 'CEAS', label: 'CEAS' },
    { value: 'CAHS', label: 'CAHS' },
    { value: 'CHTM', label: 'CHTM' },
  ];

  options2: MyOption[] = [];
  options3: MyOption[] = [];

  selectedOption1: string;
  selectedOption2: string;
  selectedOption3: string;

  constructor(
    private router: Router, 
    private ref: MatDialogRef<EditdetailsComponent>, 
    private buildr: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ds: DataService
  ) {
    this.selectedOption1 = ''; // Initialize selectedOption1 in the constructor
    this.selectedOption2 = '';
    this.selectedOption3 = '';
  }

  onOption1Change() {
    // Logic for populating PROGRAM based on COLLEGE DEPARTMENT

    // CCS -------------------------------------------------
    if (this.selectedOption1 === 'CCS') {
      this.options2 = [
        { value: 'BSCS', label: 'BSCS' },
        { value: 'BSIT', label: 'BSIT' },
        { value: 'BSEMC', label: 'BSEMC' },
        { value: 'ACT', label: 'ACT' },
      ];
    }
    // CBA -------------------------------------------------
    else if (this.selectedOption1 === 'CBA') {
      this.options2 = [
        { value: 'BSA', label: 'BSA' },
        { value: 'BSCA', label: 'BSCA' },
        { value: 'BSBA-FM', label: 'BSBA-FM' },
        { value: 'BSBA-MKT', label: 'BSBA-MKT' },
        { value: 'BSBA-HRM', label: 'BSBA-HRM' },
      ];
    }
    // CEAS -------------------------------------------------
    else if (this.selectedOption1 === 'CEAS') {
      this.options2 = [
        { value: 'BACOMM', label: 'BACOMM' },
        { value: 'BEED', label: 'BEED' },
        { value: 'BPED', label: 'BPED' },
        { value: 'BCAED', label: 'BCAED' },
        { value: 'BECED', label: 'BECED' },
        { value: 'BSED-ENG', label: 'BSED-ENG' },
        { value: 'BSED-FIL', label: 'BSED-FIL' },
        { value: 'BSED-MATH', label: 'BSED-MATH' },
        { value: 'BSED-SCI', label: 'BSED-SCI' },
        { value: 'BSED-SOC', label: 'BSED-SOC' }
      ];
    }
    // CAHS -------------------------------------------------
    else if (this.selectedOption1 === 'CAHS') {
      this.options2 = [
        { value: 'BSM', label: 'BSM' },
        { value: 'BSN', label: 'BSN' }
      ];
    }
    // CHTM -------------------------------------------------
    else if (this.selectedOption1 === 'CHTM') {
      this.options2 = [
        { value: 'BSHM', label: 'BSHM' },
        { value: 'BSTM', label: 'BSTM' }
      ];
    } 
    
    else {
      this.options2 = [];
    }

    this.selectedOption2 = '';
    this.options3 = []; // Reset options3 when the first select menu changes
    this.selectedOption3 = ''; // Reset selectedOption3 when the first select menu changes
  }


  onOption2Change() {
    // Logic for populating PROJECT TYPE based on COLLEGE PROGRAM

    // CCS PROGRAMS -------------------------------------------------
    if (this.selectedOption2 === 'BSCS') {
      this.options3 = [
        { value: 'Thesis', label: 'Thesis' }
      ];
    } 
    else if (this.selectedOption2 === 'BSIT') {
      this.options3 = [
        { value: 'Capstone', label: 'Capstone' }
      ];
    } 
    else if (this.selectedOption2 === 'BSEMC') {
      this.options3 = [
        { value: '', label: '' }
      ];
    } 
    else if (this.selectedOption2 === 'ACT') {
      this.options3 = [
        { value: '', label: '' }
      ];
    }
    // CBA PROGRAMS -------------------------------------------------
    else if (this.selectedOption2 === 'BSA') {
      this.options3 = [
        { value: '', label: '' }
      ];
    } 
    else if (this.selectedOption2 === 'BSCA') {
      this.options3 = [
        { value: '', label: '' }
      ];
    } 
    else if (this.selectedOption2 === 'BSBA-FM') {
      this.options3 = [
        { value: 'Feasibility', label: 'Feasibility' }
      ];
    } 
    else if (this.selectedOption2 === 'BSBA-MKT') {
      this.options3 = [
        { value: '', label: '' }
      ];
    } 
    else if (this.selectedOption2 === 'BSBA-HRM') {
      this.options3 = [
        { value: '', label: '' }
      ];
    }

    // CEAS PROGRAMS -------------------------------------------------
    else if (this.selectedOption2 === 'BACOMM') {
      this.options3 = [
        { value: '', label: '' }
      ];
    }
    else if (this.selectedOption2 === 'BEED') {
      this.options3 = [
        { value: 'Classroom Based Action Research', label: 'Classroom Based Action Research' }
      ];
    }
    else if (this.selectedOption2 === 'BPED') {
      this.options3 = [
        { value: '', label: '' }
      ];
    }
    else if (this.selectedOption2 === 'BCAED') {
      this.options3 = [
        { value: '', label: '' }
      ];
    }
    else if (this.selectedOption2 === 'BECED') {
      this.options3 = [
        { value: '', label: '' }
      ];
    }
    else if (this.selectedOption2 === 'BSED-ENG') {
      this.options3 = [
        { value: '', label: '' }
      ];
    }
    else if (this.selectedOption2 === 'BSED-FIL') {
      this.options3 = [
        { value: '', label: '' }
      ];
    }
    else if (this.selectedOption2 === 'BSED-MATH') {
      this.options3 = [
        { value: '', label: '' }
      ];
    }
    else if (this.selectedOption2 === 'BSED-SCI') {
      this.options3 = [
        { value: '', label: '' }
      ];
    }
    else if (this.selectedOption2 === 'BSED-SOC') {
      this.options3 = [
        { value: '', label: '' }
      ];
    }

    // CAHS PROGRAMS -------------------------------------------------
    else if (this.selectedOption2 === 'BSN') {
      this.options3 = [
        { value: 'Case Presentation', label: 'Case Presentation' }
      ];
    } 
    else if (this.selectedOption2 === 'BSM') {
      this.options3 = [
        { value: 'Case Presentation', label: 'Case Presentation' }
      ];
    }
    // CHTM PROGRAMS -------------------------------------------------
    else if (this.selectedOption2 === 'BSTM') {
      this.options3 = [
        { value: 'Thesis', label: 'Thesis' }
      ];
    } 
    else if (this.selectedOption2 === 'BSHM') {
      this.options3 = [
        { value: 'Thesis', label: 'Thesis' }
      ];
    } 

    else {
      this.options3 = [];
    }

    this.selectedOption3 = '';
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

  ngOnInit(): void {
    console.log(this.data.details)
  }

  closepopup() {
    this.ref.close('Closed using function');
  }

  // SWEETALERT UPDATE POPUP
  protected updateBox() {
    var form = document.getElementById('edit-form') as HTMLFormElement;

      // Get the form elements
    const elements = form.elements;

    // Create an object to store form values
    // var formData : { [key: string]: any } = {};

    let formData = new FormData();

    // Loop through each form element
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i] as HTMLInputElement;

      // Check if the element is an input field
      if (element.tagName === 'INPUT' || element.tagName === 'SELECT') {

        if (element.type !== 'file' && element.id !== 'submit' && element.value !== '') {
          formData.append(element.name, element.value);
        } else if (element.type === 'file' && element.files && element.files.length > 0) {
          formData.append(element.name, element.files[0]);
        }

      }
    }

    formData.forEach((value, key) => {
      console.log("%s: %s", key, value);
    })

    formData.append('_method', 'PUT');
    this.ds.post('projects/process/' + this.data.details.id, formData).subscribe({
      next: (res: any) => {
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