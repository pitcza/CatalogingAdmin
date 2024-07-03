import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { DataService } from '../../../../../../../services/data.service';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { PeriodicalService } from '../../../../../../../services/materials/periodical/periodical.service';

@Component({
  selector: 'app-edit-periodical',
  templateUrl: './edit-periodical.component.html',
  styleUrl: './edit-periodical.component.scss'
})

export class EditPeriodicalComponent implements OnInit{
  
  year: number[] = [];
  currentYear = new Date().getFullYear();
  periodical: any;
  editForm: FormGroup;
  image: any;
  imageUrl: any;

  constructor(private ref: MatDialogRef<EditPeriodicalComponent>, 
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    private periodicalService: PeriodicalService
  ) {

    for(let i = 1991; i <= this.currentYear; i++) {
      this.year.push(i);
    }

    this.editForm = formBuilder.group({
      accession: ['', Validators.required],
      title: ['', [Validators.required, Validators.maxLength(255)]],
      authors: ['', Validators.required],
      publisher: ['', Validators.required],
      remarks: [''],
      pages: ['', Validators.required],
      periodical_type: ['0', Validators.required],
      volume: ['', Validators.required],
      issue: ['', Validators.required],
      language: ['English', Validators.required],
      acquired_date: ['', Validators.required],
      date_published: ['', Validators.required],
      copyright: [2024, Validators.required]
    });
   }

  ngOnInit(): void {
    this.periodicalService.getRecord(this.data.details).subscribe((res: any) => {
      this.periodical = res;
      this.values = this.periodical.authors;

      this.editForm.patchValue({
        accession: this.periodical.accession,
        title: this.periodical.title,
        publisher: this.periodical.publisher,
        remarks: this.periodical.remarks,
        pages: this.periodical.pages,
        periodical_type: this.periodical.periodical_type,
        volume: this.periodical.volume,
        issue: this.periodical.issue,
        language: this.periodical.language,
        acquired_date: this.periodical.acquired_date,
        date_published: this.periodical.date_published,
        copyright: this.periodical.copyright
      });
    })
  }
   
  closepopup(text: string) {
    this.ref.close(text);
  }

  // ARCHIVE POPUP
  archiveBox(){
    Swal.fire({
      title: "Archive Periodical",
      text: "Are you sure want to archive this periodical?",
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
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.closepopup('Archive');
        Swal.fire({
          title: "Archiving complete!",
          text: "Periodical has been safely archived.",
          icon: "success",
          confirmButtonText: 'Close',
          confirmButtonColor: "#777777",
          scrollbarPadding: false,
          timer: 5000,
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
      },
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

  // ----- AUTHORS ----- //
  values = [''];

  // Track by function to minimize re-renders
  trackByIndex(index: number, item: any): number {
    return index;
  }

  removevalue(i: any){
    this.values.splice(i, 1);
  }

  addvalue(){
    if (this.values.length < 3) {
      this.values.push('');
    }
    console.log(this.values)
  }

  updateValue($event: Event, index: number) {
    this.values[index] = ($event.target as HTMLInputElement).value;
  }

  isMaxLimitReached(): boolean {
    return this.values.length >= 3;
  }
  // ----- END OF AUTHORS ----- //
  
  imageUpload(event: Event): void {
    const input = event.target as HTMLInputElement;

    // Check if there are files selected
    if (input.files && input.files.length) {
      const file = input.files[0];  // Get the first selected file

      // Check if the selected file is an image
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();  // Create a new FileReader instance

        // Define the onload callback for the FileReader
        reader.onload = () => this.imageUrl = reader.result; 

        reader.readAsDataURL(file);  // Read the file as a data URL

        this.image = file;

      } else {
        input.value = ''; // removes the file
        Swal.fire({
          title: 'File Error',
          text: "Invalid File! Only files with extensions .png, .jpg, .jpeg are allowed.",
          icon: 'error',
          confirmButtonText: 'Close',
          confirmButtonColor: "#777777",
          scrollbarPadding: false,
          willOpen: () => {
            document.body.style.overflowY = 'scroll';
          },
          willClose: () => {
            document.body.style.overflowY = 'scroll';
          }
        });
      }
    } 
  }

  validateAuthors() {
    let valid = true;
    let isNull = false;
    let isExceeded = false;

      if(this.values.length > 50) {
        valid = false;
        isExceeded = true;
      }

    return {'valid': valid, 'null': isNull, 'maxLength': isExceeded};
  }

  protected updateBox() {

    if(this.editForm.valid && this.validateAuthors().valid) {

      this.editForm.patchValue({
        authors: JSON.stringify(this.values)
      });

      // pass datas to formdata to allow sending of files
      let form = new FormData();
      
      Object.entries(this.editForm.value).forEach(([key, value]: [string, any]) => {
        if(value != '' && value != null)
          form.append(key, value);
      });

      if(this.image) {
        form.append('image_url', this.image);
      }

      this.periodicalService.updateRecord(this.data.details, form).subscribe({
        next: (res: any) => {
          Swal.fire({
            title: 'Success',
            text: "Periodical of accession " + form.get('accession') + " has been successfully updated!",
            icon: 'success',
            confirmButtonText: 'Close',
            confirmButtonColor: "#777777",
          });
        },
        error: (err: any) => {
          Swal.fire({
            title: 'Oops! Server Side Error!',
            text: 'Please try again later or contact the developers',
            icon: 'error',
            confirmButtonText: 'Close',
            confirmButtonColor: "#777777",
          });
        }
      });
    } else {
      Swal.fire({
        title: 'Oops! Form Submission Error!',
        text: 'Please kindly check the form.',
        icon: 'error',
        confirmButtonText: 'Close',
        confirmButtonColor: "#777777",
      });
    }
  }
}