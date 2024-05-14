import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../services/data.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-addmaterials',
  templateUrl: './addmaterials.component.html',
  styleUrl: './addmaterials.component.scss'
})
export class AddmaterialsComponent implements OnInit{

  constructor(
    private ds: DataService
  ) { }

  protected locations: any = null;
  currentYear = new Date().getFullYear();
  year: number[] = [];

  ngOnInit(): void {
      this.getLocations();
      this.bookSubmit();
      this.periodicalSubmit();
      this.articleSubmit();

      for(let i = 1990; i <= this.currentYear; i++) {
        this.year.push(i);
      }
  }

  /* ============= BOOK SUBMISSION ============== */

  protected bookSubmit() {
    var form = document.getElementById('book-form') as HTMLFormElement;

    form.addEventListener('submit', (event) => {
      // Prevent the default form submission behavior
      event.preventDefault();

      let valid = true;
      let validFile = true;
      const fields = ['title', 'author', 'copyright', 'pages', 'acquired_date', 'source_of_fund',
        'location_id', 'price', 'call_number', 'copies'];
  
      // Get the form elements
      const elements = form.elements;

      let formData = new FormData();
  
      // Loop through each form element
      for (let i = 0; i < elements.length; i++) {
        const element = elements[i] as HTMLInputElement;

        // Check if the element is an input field
        if (element.tagName === 'INPUT' || element.tagName === 'SELECT' && element.id !== 'submit') {
            if (element.type !== 'file'  && element.value !== '') {
              formData.append(element.name, element.value);
            } else if (element.type === 'file' && element.files && element.files.length > 0) {
              const file = element.files[0];
              if(file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png') {
                formData.append(element.name, element.files[0]);
              } else {
                validFile = false;
              }
            }
          
          if(fields.includes(element.name) && element.value == '') {
            valid = false;
            element.style.borderColor = 'red';
          } else 
              element.style.borderColor = 'black';
          
        }
      }

      // DATA IS VALID
      if(valid && validFile) {
        this.ds.post('books/process', formData).subscribe({
          next: (res: any) => {
            Swal.fire({
              title: 'Success',
              text: formData.get('title') + " has been added successfully",
              icon: 'success',
              confirmButtonText: 'Close',
              confirmButtonColor: "#777777",
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
        });
      } else if (!validFile) {
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

  protected getLocations() {
    this.ds.get('books/locations').subscribe((res: any) => {
      this.locations = res;
      console.log(this.locations)
    })
  }

  /* ============== PERIODCIAL SUBMISSION ============== */
  protected periodicalSubmit() {
    var form = document.getElementById('periodical-form') as HTMLFormElement;

    form.addEventListener('submit', (event) => {
      // Prevent the default form submission behavior
      event.preventDefault();
  
      // Get the form elements
      const elements = form.elements;

      let formData = new FormData();

      let fields = ['material_type', 'author', 'title', 'issue', 'language', 'receive_date',
        'date_published', 'copyright', 'publisher', 'volume', 'pages'];
      let valid = true;
      let validFile = true;
  
      // Loop through each form element
      for (let i = 0; i < elements.length; i++) {
          const element = elements[i] as HTMLInputElement;
  
          // Check if the element is an input field
          if (element.tagName === 'INPUT' || element.tagName === 'SELECT') {
            if (element.type !== 'file' && element.id !== 'submit' && element.value !== '') {
              formData.append(element.name, element.value);
            } else if (element.type === 'file' && element.files && element.files.length > 0) {
              const file = element.files[0];
              if(file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png') {
                formData.append(element.name, element.files[0]);
              } else {
                validFile = false;
              }
            }

            if(fields.includes(element.name) && element.value == '') {
              valid = false;
              element.style.borderColor = 'red';
            } else 
                element.style.borderColor = 'black';
          }
      }

      // DATA IS VALID
      if(valid && validFile) {
        this.ds.post('periodicals/process', formData).subscribe({
          next: (res: any) => {
            Swal.fire({
              title: 'Success',
              text: formData.get('title') + " has been added successfully",
              icon: 'success',
              confirmButtonText: 'Close',
              confirmButtonColor: "#777777",
            });
          },
          error: (err: any) => {
            Swal.fire({
              title: 'Error',
              text: "Oops an error occured",
              icon: 'error',
              confirmButtonText: 'Close',
              confirmButtonColor: "#777777",
            });
          }
        });
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

  /* =========== ARTICLE SUBMISSION ==================== */
  protected articleSubmit() {
    var form = document.getElementById('article-form') as HTMLFormElement;

    form.addEventListener('submit', (event) => {
      // Prevent the default form submission behavior
      event.preventDefault();
  
      // Get the form elements
      const elements = form.elements;

      let formData = new FormData();

      let fields = ['material_type', 'author', 'title', 'subject', 'abstract', 'issue', 'language', 'receive_date',
        'date_published', 'copyright', 'publisher', 'volume', 'pages'];
      let valid = true;
  
      // Loop through each form element
      for (let i = 0; i < elements.length; i++) {
          const element = elements[i] as HTMLInputElement;
  
          // Check if the element is an input field
          if (element.tagName === 'INPUT' || element.tagName === 'SELECT' || element.tagName === 'TEXTAREA') {
            if (element.type !== 'submit' && element.value !== ''){
              formData.append(element.name, element.value);
            }

            if(fields.includes(element.name) && element.value == '') {
              valid = false;
              element.style.borderColor = 'red';
            } else 
                element.style.borderColor = 'black';
          }
      }

      if(valid) {
        this.ds.post('articles/process',  formData).subscribe({
          next: (res: any) => {
            console.log(res)
            Swal.fire({
              title: 'Success',
              text: formData.get('title') + " has been added successfully",
              icon: 'success',
              confirmButtonText: 'Close',
              confirmButtonColor: "#777777",
            });
          },
          error: (err: any) => {
            Swal.fire({
              title: 'Error',
              text: "Oops an error occured",
              icon: 'error',
              confirmButtonText: 'Close',
              confirmButtonColor: "#777777",
            });
          }
        });
      } else {
        Swal.fire({
          title: 'Oops! Error on form',
          text: "Please check if required fields have values",
          icon: 'error',
          confirmButtonText: 'Close',
          confirmButtonColor: "#777777",
        });
      }
    });
  }
}
