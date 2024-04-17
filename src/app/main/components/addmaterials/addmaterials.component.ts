import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../services/data.service';

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
  }

  protected submit() {
    var form = document.getElementById('submit-form') as HTMLFormElement;

    form.addEventListener('submit', (event) => {
      // Prevent the default form submission behavior
      event.preventDefault();
  
      // Get the form elements
      const elements = form.elements;
  
      // Create an object to store form values
      const formData: { [key: string]: any } = {};
  
      // Loop through each form element
      for (let i = 0; i < elements.length; i++) {
          const element = elements[i] as HTMLInputElement;
  
          // Check if the element is an input field
          if (element.tagName === 'INPUT' && element.id != 'login-button') {
              // Store the value in the formData object with the element's name as key
              formData[element.name] = element.value;
          }
      }
  
      // Now you have all the form values in the formData object
      console.log(formData);

      // this.ds.post('login/', 'cataloging', formData).subscribe((res: any) => {
      //   console.log(res)
      // })
    });
  }

  protected getLocations() {
    this.ds.get('books/locations', '').subscribe((res: any) => {
      this.locations = res;
      console.log(this.locations)
    })
  }
}
