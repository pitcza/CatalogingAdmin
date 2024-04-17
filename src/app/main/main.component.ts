import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit{

  constructor(
    private router: Router,
    private ds: DataService  
  ) { }

  ngOnInit(): void {
    if(localStorage.getItem('auth-token') == null)
      this.router.navigate(['login']);
  }

  showPopup: boolean = false;

  togglePopup() {
    this.showPopup = !this.showPopup;
  }

  closePopup() {
    this.showPopup = this.showPopup;
  }

/*  protected logout() {
    this.ds.logout().subscribe({
      next: (res: any) => {
        localStorage.clear();
        this.router.navigate(['login']); 
        // include sweetalert popup o kung ano man
      }, error: (err: any) => {
        console.log(err)
      }
    });

  } */
}