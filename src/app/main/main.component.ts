import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit, OnDestroy {

  constructor(
    private router: Router,
    private as: AuthService
  ) { }

  timer: any;
  name = localStorage.getItem('name');
  role = localStorage.getItem('role');

  ngOnInit(): void {

    // Refresh user token every 55 minutes (under construction)
    this.timer = setInterval(() => {
      let currentTime = new Date();
      let newCurrentTime = currentTime.toISOString();

      if (Date.parse(localStorage.getItem('request-token') || '0') <= Date.parse(newCurrentTime)) {
        this.refreshToken();
        console.log('yeah')
      } 
    }, 60 * 1000)
  }
  
  protected refreshToken() {
    this.as.refresh().subscribe({
      next: (res: any) => {
        localStorage.setItem('auth-token', res.token);

        let time = new Date();
        time.setMinutes(time.getMinutes() + 55);
        localStorage.setItem('request-token', time.toISOString());
      },
      error: (err: any) => console.log(err)
    });
  }

  showPopup: boolean = false;

  togglePopup() {
    this.showPopup = !this.showPopup;
  }

  closePopup() {
    this.showPopup = this.showPopup;
  }

 protected logout() {
    this.as.logout().subscribe({
      next: (res: any) => {
        sessionStorage.clear();
        this.router.navigate(['login']); 
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
          title: "Logged out successfully"
        });
      }
    });
  } 

  // Destroys the timer
  ngOnDestroy(): void {
      clearInterval(this.timer)
  }
}