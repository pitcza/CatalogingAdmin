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

  ngOnInit(): void {
      this.getLocations();
      this.bookSubmit();
      this.periodicalSubmit();
      this.articleSubmit();
  }

  protected bookSubmit() {
    var form = document.getElementById('book-form') as HTMLFormElement;

    form.addEventListener('submit', (event) => {
      // Prevent the default form submission behavior
      event.preventDefault();
  
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

      this.ds.post('books/process', '', formData).subscribe({
        next: (res: any) => console.log(res),
        error: (err: any) => console.log(err)
      });
    });
  }

  protected getLocations() {
    this.ds.get('books/locations', '').subscribe((res: any) => {
      this.locations = res;
      console.log(this.locations)
    })
  }

  protected periodicalSubmit() {
    var form = document.getElementById('periodical-form') as HTMLFormElement;

    form.addEventListener('submit', (event) => {
      // Prevent the default form submission behavior
      event.preventDefault();
  
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
            if (element.id != 'submit')
              // formData[element.name] = element.value;
              formData.append(element.name, element.value);
          }
      }

      // this.ds.post('books/process', '', formData).subscribe({
      //   next: (res: any) => console.log(res),
      //   error: (err: any) => console.log(err)
      // });

      console.log(formData)
    });
  }

  protected articleSubmit() {
    var form = document.getElementById('article-form') as HTMLFormElement;

    form.addEventListener('submit', (event) => {
      // Prevent the default form submission behavior
      event.preventDefault();
  
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
            if (element.id != 'submit' && element.value != ''){
              // formData[element.name] = element.value;

              formData.append(element.name, element.value);
            }
          }
      }

      this.ds.post('articles/process', '', formData).subscribe({
        next: (res: any) => console.log(res),
        error: (err: any) => console.log(err)
      });
      formData.forEach((value, key) => {
        console.log("%s: %s", key, value);
        })
    });
  }
}
