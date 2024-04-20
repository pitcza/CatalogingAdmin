import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { of } from 'rxjs';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  constructor(
    private as: AuthService,
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
      // var formData: { [key: string]: any } = {};

      let formData = new FormData();
  
      // Loop through each form element
      for (let i = 0; i < elements.length; i++) {
          var element = elements[i] as HTMLInputElement;
  
          // Check if the element is an input field
          if (element.tagName === 'INPUT' && element.id != 'login-button') {
            formData.append(element.name, element.value);
          }
      }

      this.as.login(formData).subscribe({
        next: (res: any) => {
          localStorage.setItem('auth-token', res.token);
          localStorage.setItem('timer', '1');
          this.router.navigate(['main']);
          // hindi na ba need alert
          // kahit wag na siguro para malinis tignan
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
            icon: "success",
            title: "Signed in successfully"
          });
        },
      });
    });
  }
}
