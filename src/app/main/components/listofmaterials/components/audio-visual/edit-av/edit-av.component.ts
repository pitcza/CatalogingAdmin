import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-av',
  templateUrl: './edit-av.component.html',
  styleUrl: './edit-av.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
})
export class EditAVComponent {
  editForm: FormGroup;
  year: number[] = [];
  currentYear = new Date().getFullYear();

  constructor(
    private ref: MatDialogRef<EditAVComponent>, 
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private router: Router
  ) { 

    for(let i = 1991; i <= this.currentYear; i++) {
      this.year.push(i);
    }

    this.editForm = formBuilder.group({
      accession: ['', Validators.required],
      title: ['', [Validators.required, Validators.maxLength(255)]],
      authors: ['', Validators.required],
      call_number: ['', Validators.required],
      copyright: [2024, Validators.required]
    });
  }

  // ----- AUTHORS ----- //
  values = [''];

  removeValue(i: any) {
    this.values.splice(i, 1);
  }

  addValue() {
    if (this.values.length < 5) {
      this.values.push('');
    }
  }

  updateValue(event: Event, i: number) {
    let input = event.target as HTMLInputElement;
    this.values[i] = input.value;
  }

  isMaxLimitReached(): boolean {
    return this.values.length >= 5;
  }
  
  trackByIndex(index: number): number {
    return index;
  }
  // ----- END OF AUTHORS ----- //

  // RED INPUT FIELD
  isInvalid(controlName: string): boolean {
    const control = this.editForm.get(controlName);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }
  
  // FOR LABEL PO, YUNG SA ANIMATION NA NATAAS-BABA
  isFieldFilled(fieldName: string): boolean {
    const control = this.editForm.get(fieldName);
    return !!control && control.value !== null && control.value !== '';
  }

  closepopup(text: string) {
    this.ref.close(text);
  }

  // ARCHIVE POPUP
  archiveBox(){
    Swal.fire({
      title: "Archive Audio-Visual",
      text: "Are you sure want to archive this audio-visual?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
      confirmButtonColor: "#AB0E0E",
      cancelButtonColor: "#777777",
      scrollbarPadding: false,
      willOpen: () => {
        document.body.style.overflowY = 'scroll';
      },
      willClose: () => {
        document.body.style.overflowY = 'scroll';
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.closepopup('Archive');
        Swal.fire({
          title: "Archiving complete!",
          text: "Audio-Visual has been safely archived.",
          icon: "success",
          confirmButtonText: 'Close',
          confirmButtonColor: "#777777",
          scrollbarPadding: false,
        });
      }
    });
  }

  // CANCEL EDITING POPUP
  cancelBox(){
    Swal.fire({
      title: "Are you sure you want to cancel editing details?",
      text: "Your changes will not be saved.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      confirmButtonColor: "#AB0E0E",
      cancelButtonColor: "#777777",
      scrollbarPadding: false,
      willOpen: () => {
        document.body.style.overflowY = 'scroll';
      },
      willClose: () => {
        document.body.style.overflowY = 'scroll';
      }
    }).then((result) => {
      if (result.isConfirmed) {
          this.closepopup('');
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
            title: "Changes not saved."
          });
      }
    });
  }

  // UPDATE DETAILS
  protected updateAV() {
    Swal.fire({
      title: "Update Audio-Visual",
      text: "Would you like to save these changes?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: 'Confirm', // confirm or yes or update or ewan na?
      cancelButtonText: 'Cancel',
      confirmButtonColor: "#4F6F52",
      cancelButtonColor: "#777777",
      scrollbarPadding: false,
      willOpen: () => {
        document.body.style.overflowY = 'scroll';
      },
      willClose: () => {
        document.body.style.overflowY = 'scroll';
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.closepopup('Update');
        Swal.fire({
          title: "Details Updated",
          text: "Audio-Visual has been updated successfully",
          icon: "success",
          confirmButtonText: 'Close',
          confirmButtonColor: "#777777",
          scrollbarPadding: false,
        });
      }
    });
  }

  // SUCCESS AND ERROR MESSAGES
  successMessage(title:string) {
    Swal.fire({
      title: 'Success',
      text: title + " has been added successfully",
      icon: 'success',
      confirmButtonText: 'Close',
      confirmButtonColor: "#777777",
    });
  }

  serverErrors() {
    Swal.fire({
      title: 'Oops! Server Side Error!',
      text: 'Please try again later or contact the developers',
      icon: 'error',
      confirmButtonText: 'Close',
      confirmButtonColor: "#777777",
    });
  }
}
