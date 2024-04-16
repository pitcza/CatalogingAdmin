import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { of } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  constructor(
    private ds: DataService,
    private router: Router
  ) { }

  showpassword = false;

  toggleShow() {
    this.showpassword = !this.showpassword
  }

  ngOnInit(): void {
    var form = document.getElementById('login-form') as HTMLFormElement;

    form.addEventListener('submit', (event) => {
      // Prevent the default form submission behavior
      event.preventDefault();
  
      // Get the form elements
      var elements = form.elements;
  
      // Create an object to store form values
      var formData: { [key: string]: any } = {};
  
      // Loop through each form element
      for (let i = 0; i < elements.length; i++) {
          var element = elements[i] as HTMLInputElement;
  
          // Check if the element is an input field
          if (element.tagName === 'INPUT' && element.id != 'login-button') {
              // Store the value in the formData object with the element's name as key
              formData[element.name] = element.value;
          }
      }

      this.ds.post('login/', 'cataloging', formData).subscribe({
        next: (res: any) => {
          localStorage.setItem('auth-token', res.token);
          this.router.navigate(['main']);
        },
        error: (err: any) => {
          console.log('Error:', err.statusText)
          // insert sweet alert
        }
      });
    });
  }
}
