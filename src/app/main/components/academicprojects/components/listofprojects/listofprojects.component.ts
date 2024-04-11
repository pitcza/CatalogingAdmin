import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listofprojects',
  templateUrl: './listofprojects.component.html',
  styleUrl: './listofprojects.component.scss'
})
export class ListofprojectsComponent {
  constructor(private router: Router) { }
  
  // DELETE POP UP
  showPopup: boolean = false;

  togglePopup() {
    this.showPopup = !this.showPopup;
  }

  closePopup() {
    this.showPopup = this.showPopup;
  }

  redirectToListPage() {
    this.router.navigate(['main/academicprojects/listofprojects']); 
  }


  // DETAILS POP UP 
  showDetails: boolean = false;

  toggleDetails() {
    this.showDetails = !this.showDetails;
  }

  closeDetails() {
    this.showDetails = this.showDetails;
  }
}
