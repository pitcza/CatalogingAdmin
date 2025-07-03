import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.maxLength(30)]],
    password: ['', [Validators.required, Validators.maxLength(30)]],
  });

  constructor(
    private as: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  showpassword = false;

  toggleShow() {
    this.showpassword = !this.showpassword;
  }

  login() {
    if (this.loginForm.valid) {
      this.as.login(this.loginForm.value).subscribe({
        next: (res: any) => {
          this.router.navigate(['main']);
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2500,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            },
          });
          Toast.fire({
            icon: 'success',
            title: 'Signed in successfully',
          });
        },
        //   Swal.fire({
        //     title: "Login Error!",
        //     text: "Error contacting server",
        //     icon: "error",
        //     confirmButtonText: 'Close',
        //     confirmButtonColor: "#777777",
        //     scrollbarPadding: false,
        //   });
        // }
      });
    } else {
      Swal.fire({
        title: 'Login Error!',
        text: 'Please check input fields.',
        icon: 'error',
        confirmButtonText: 'Close',
        confirmButtonColor: '#777777',
        scrollbarPadding: false,
      });
    }
  }
}
