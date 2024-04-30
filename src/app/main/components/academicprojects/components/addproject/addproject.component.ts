import { Component, ElementRef, OnInit, ViewChild   } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

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
  // FOR COLLEGE, PROGRAM, AND CATEGORY OF THE PROJECT
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

  constructor(private router: Router,
    private elementRef: ElementRef
  ) {
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
        { value: '', label: '' }
      ];
    } 
    else if (this.selectedOption2 === 'BSBA-HRM') {
      this.options3 = [
        { value: '', label: '' }
      ];
    }

    // CEAS PROGRAMS -------------------------------------------------
    else if (this.selectedOption2 === 'BACOMM') {
      this.options3 = [
        { value: '', label: '' }
      ];
    }
    else if (this.selectedOption2 === 'BEED') {
      this.options3 = [
        { value: 'Classroom Based Action Research', label: 'Classroom Based Action Research' }
      ];
    }
    else if (this.selectedOption2 === 'BPED') {
      this.options3 = [
        { value: '', label: '' }
      ];
    }
    else if (this.selectedOption2 === 'BCAED') {
      this.options3 = [
        { value: '', label: '' }
      ];
    }
    else if (this.selectedOption2 === 'BECED') {
      this.options3 = [
        { value: '', label: '' }
      ];
    }
    else if (this.selectedOption2 === 'BSED-ENG') {
      this.options3 = [
        { value: '', label: '' }
      ];
    }
    else if (this.selectedOption2 === 'BSED-FIL') {
      this.options3 = [
        { value: '', label: '' }
      ];
    }
    else if (this.selectedOption2 === 'BSED-MATH') {
      this.options3 = [
        { value: '', label: '' }
      ];
    }
    else if (this.selectedOption2 === 'BSED-SCI') {
      this.options3 = [
        { value: '', label: '' }
      ];
    }
    else if (this.selectedOption2 === 'BSED-SOC') {
      this.options3 = [
        { value: '', label: '' }
      ];
    }

    // CAHS PROGRAMS -------------------------------------------------
    else if (this.selectedOption2 === 'BSN') {
      this.options3 = [
        { value: 'Case Presentation', label: 'Case Presentation' }
      ];
    } 
    else if (this.selectedOption2 === 'BSM') {
      this.options3 = [
        { value: 'Case Presentation', label: 'Case Presentation' }
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


  // DYNAMIC ADD MULTIPLE AUTHOR
  ngOnInit() {
    this.values = this.inputValues.map(input => ({ ...input }));
  }

  inputValues: { value: string }[] = [{ value: "" }];
  values: { value: string }[] = [];

  removevalue(i: any){
    this.values.splice(i, 1);
  }

  addvalue(){
    if (this.inputValues.length <6) {
    // Add a new input value to the inputValues array
    this.inputValues.push({ value: "" });
    // Update the values array with the current input values
    this.values = this.inputValues.map(input => ({ ...input }));
    }
  }

  isMaxLimitReached(): boolean {
    return this.inputValues.length >= 6;
  }

  // KEYWORDS FUNCTION NA HINDI NAGF-FUNCTION
  // maxTags: number = 10;
  // tags: string[] = ["coding", "nepal"];

  // countTags() {
  //   let tagNumb = document.querySelector(".details span");
  //   if (tagNumb) {
  //     tagNumb.textContent = String(this.maxTags - this.tags.length);
  //   }
  // }

  // createTag() {
  //   let ul = document.querySelector("ul");
  //   if (ul) {
  //     ul.innerHTML = ''; // Clear existing content
  //     this.tags.slice().reverse().forEach(tag => {
  //       let liTag = `<li>${tag} <i class="uit uit-multiply" (click)="remove('${tag}')"></i></li>`;
  //       ul!.insertAdjacentHTML("afterbegin", liTag); // Use 'ul!' to assert non-null
  //     });
  //     this.countTags();
  //   } else {
  //     console.error("UL element not found");
  //   }
  // }

  // remove(tag: string) {
  //   let index = this.tags.indexOf(tag);
  //   this.tags = [...this.tags.slice(0, index), ...this.tags.slice(index + 1)];
  //   this.createTag();
  // }

  // addTag(e: any) {
  //   if (e.key == "Enter") {
  //     let tag = e.target.value.replace(/\s+/g, ' ');
  //     if (tag.length > 1 && !this.tags.includes(tag)) {
  //       if (this.tags.length < this.maxTags) {
  //         tag.split(',').forEach((tag: string) => {
  //           this.tags.push(tag);
  //           this.createTag();
  //         });
  //       }
  //     }
  //     e.target.value = "";
  //   }
  // }

  // removeAll() {
  //   this.tags.length = 0;
  //   let ul = document.querySelector("ul");
  //   if (ul) {
  //     ul.querySelectorAll("li").forEach(li => li.remove());
  //   }
  //   this.countTags();
  // }




  // POP UP FUNCTION CONTENT
  showPopup: boolean = false;

  closePopup() {
    this.showPopup = this.showPopup;
  }

  addBox() {
    this.router.navigate(['main/academicprojects/listofprojects']); 
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });
    Toast.fire({
      icon: "success",
      title: "Project Successfully Added."
    });
  }

  cancelBox(){
    Swal.fire({
      title: "Are you sure you want to cancel?",
      text: "Your changes will not be saved.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      confirmButtonColor: "#AB0E0E",
      cancelButtonColor: "#777777",
    }).then((result) => {
      if (result.isConfirmed) {
          this.router.navigate(['main/academicprojects/listofprojects']); 
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
            icon: "error",
            title: "Project not saved."
          });
      }
    });
  }

}