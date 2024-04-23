import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

import Swal from 'sweetalert2';
import { timer } from 'rxjs';

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
  user: any;

  ngOnInit(): void {

    this.as.user().subscribe({
      next: (res: any) => this.user = res
    });

    // Refresh user token every 55 minutes (under construction)
    this.timer = setInterval(() => {
      let timer = parseInt(localStorage.getItem('timer') || '0', 10);
      timer = timer + 1;
      if(timer >=  55 * 60) {
        this.refreshToken();
        localStorage.setItem('timer', '0');
      } else {
        localStorage.setItem('timer', timer.toString());
      } 
    }, 1000);
  }
  
  protected refreshToken() {
    this.as.refresh().subscribe({
      next: (res: any) => localStorage.setItem('auth-token', res.token),
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
        localStorage.clear();
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