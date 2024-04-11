import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface MyOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-addproject',
  templateUrl: './addproject.component.html',
  styleUrl: './addproject.component.scss'
})

export class AddprojectComponent {
  options1 = [
    { value: 'CCS', label: 'CCS' },
    { value: 'CBA', label: 'CBA' },
    { value: 'CEAS', label: 'CEAS' },
    { value: 'CAHS', label: 'CAHS' },
    { value: 'CHTM', label: 'CHTM' },
  ];

  options2: MyOption[] = [];
  options3: MyOption[] = [];

  selectedOption1: string;
  selectedOption2: string;
  selectedOption3: string;

  constructor(private router: Router) {
    this.selectedOption1 = ''; // Initialize selectedOption1 in the constructor
    this.selectedOption2 = '';
    this.selectedOption3 = '';
  }

  onOption1Change() {
    // Logic for populating PROGRAM based on COLLEGE DEPARTMENT

    // CCS -------------------------------------------------
    if (this.selectedOption1 === 'CCS') {
      this.options2 = [
        { value: 'BSCS', label: 'BSCS' },
        { value: 'BSIT', label: 'BSIT' },
        { value: 'BSEMC', label: 'BSEMC' },
        { value: 'ACT', label: 'ACT' },
      ];
    }
    // CBA -------------------------------------------------
    else if (this.selectedOption1 === 'CBA') {
      this.options2 = [
        { value: 'BSA', label: 'BSA' },
        { value: 'BSCA', label: 'BSCA' },
        { value: 'BSBA-FM', label: 'BSBA-FM' },
        { value: 'BSBA-MKT', label: 'BSBA-MKT' },
        { value: 'BSBA-HRM', label: 'BSBA-HRM' },
      ];
    }
    // CEAS -------------------------------------------------
    else if (this.selectedOption1 === 'CEAS') {
      this.options2 = [
        { value: 'BACOMM', label: 'BACOMM' },
        { value: 'BEED', label: 'BEED' },
        { value: 'BPED', label: 'BPED' },
        { value: 'BCAED', label: 'BCAED' },
        { value: 'BECED', label: 'BECED' },
        { value: 'BSED-ENG', label: 'BSED-ENG' },
        { value: 'BSED-FIL', label: 'BSED-FIL' },
        { value: 'BSED-MATH', label: 'BSED-MATH' },
        { value: 'BSED-SCI', label: 'BSED-SCI' },
        { value: 'BSED-SOC', label: 'BSED-SOC' }
      ];
    }
    // CAHS -------------------------------------------------
    else if (this.selectedOption1 === 'CAHS') {
      this.options2 = [
        { value: 'BSM', label: 'BSM' },
        { value: 'BSN', label: 'BSN' }
      ];
    }
    // CHTM -------------------------------------------------
    else if (this.selectedOption1 === 'CHTM') {
      this.options2 = [
        { value: 'BSHM', label: 'BSHM' },
        { value: 'BSTM', label: 'BSTM' }
      ];
    } 
    
    else {
      this.options2 = [];
    }

    this.selectedOption2 = '';
    this.options3 = []; // Reset options3 when the first select menu changes
    this.selectedOption3 = ''; // Reset selectedOption3 when the first select menu changes
  }


  onOption2Change() {
    // Logic for populating PROJECT TYPE based on COLLEGE PROGRAM

    // CCS PROGRAMS -------------------------------------------------
    if (this.selectedOption2 === 'BSCS') {
      this.options3 = [
        { value: 'Thesis', label: 'Thesis' }
      ];
    } 
    else if (this.selectedOption2 === 'BSIT') {
      this.options3 = [
        { value: 'Capstone', label: 'Capstone' }
      ];
    } 
    else if (this.selectedOption2 === 'BSEMC') {
      this.options3 = [
        { value: '', label: '' }
      ];
    } 
    else if (this.selectedOption2 === 'ACT') {
      this.options3 = [
        { value: '', label: '' }
      ];
    }
    // CBA PROGRAMS -------------------------------------------------
    else if (this.selectedOption2 === 'BSA') {
      this.options3 = [
        { value: '', label: '' }
      ];
    } 
    else if (this.selectedOption2 === 'BSCA') {
      this.options3 = [
        { value: '', label: '' }
      ];
    } 
    else if (this.selectedOption2 === 'BSBA-FM') {
      this.options3 = [
        { value: 'Feasibility', label: 'Feasibility' }
      ];
    } 
    else if (this.selectedOption2 === 'BSBA-MKT') {
      this.options3 = [
        { value: 'Feasibility', label: 'Feasibility' }
      ];
    } 
    else if (this.selectedOption2 === 'BSBA-HRM') {
      this.options3 = [
        { value: 'Feasibility', label: 'Feasibility' }
      ];
    }
    // CEAS PROGRAMS -------------------------------------------------


    // CAHS PROGRAMS -------------------------------------------------
    else if (this.selectedOption2 === 'BSN') {
      this.options3 = [
        { value: '', label: '' }
      ];
    } 
    else if (this.selectedOption2 === 'BSM') {
      this.options3 = [
        { value: '', label: '' }
      ];
    }
    // CHTM PROGRAMS -------------------------------------------------
    else if (this.selectedOption2 === 'BSTM') {
      this.options3 = [
        { value: 'Thesis', label: 'Thesis' }
      ];
    } 
    else if (this.selectedOption2 === 'BSHM') {
      this.options3 = [
        { value: 'Thesis', label: 'Thesis' }
      ];
    } 

    else {
      this.options3 = [];
    }

    this.selectedOption3 = '';
  }








  // POP UP FUNCTION CONTENT
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

}