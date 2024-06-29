import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { DataService } from '../../../../../../../services/data.service';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import Swal from 'sweetalert2';
import { ArticleService } from '../../../../../../../services/materials/article/article.service';

interface MyOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-edit-article',
  templateUrl: './edit-article.component.html',
  styleUrl: './edit-article.component.scss'
})
export class EditArticleComponent implements OnInit{

  constructor(private ref: MatDialogRef<EditArticleComponent>, 
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private articleService: ArticleService
  ) { 
    this.editForm = formBuilder.group({
      accession: ['', [Validators.required, Validators.maxLength(20)]],
      title: ['', [Validators.required, Validators.maxLength(255)]],
      authors: ['', [Validators.required, Validators.maxLength(255)]],
      publisher: ['', [Validators.required, Validators.maxLength(100)]],
      remarks: ['', Validators.maxLength(255)],
      pages: ['', [Validators.required, Validators.maxLength(20)]],
      periodical_type: ['0', Validators.required],
      abstract: ['', [Validators.required, Validators.maxLength(4096)]],
      volume: ['', [Validators.required, Validators.maxLength(50)]],
      issue: ['', [Validators.required, Validators.maxLength(50)]],
      language: ['English', Validators.required],
      subject: ['', [Validators.required, Validators.maxLength(255)]],
      date_published: ['', Validators.required]
    });
  }

  article: any;
  image: any;
  editForm: FormGroup;

  ngOnInit(): void {
    this.articleService.getRecord(this.data.details).subscribe((res: any) => {
      this.article = res;
      this.values = this.article.authors;

      this.editForm.patchValue({
        accession: this.article.accession,
        title: this.article.title,
        publisher: this.article.publisher,
        remarks: this.article.remarks,
        pages: this.article.pages,
        periodical_type: '' + this.article.periodical_type,
        abstract: this.article.abstract,
        volume: this.article.volume,
        issue: this.article.issue,
        language: this.article.language,
        subject: this.article.subject,
        date_published: this.article.date_published
      });
    })
  }

  closepopup() {
    this.ref.close('Closed using function');
  }

  // ARCHIVE POPUP
  archiveBox(){
    Swal.fire({
      title: "Archive Article",
      text: "Are you sure want to archive this article?",
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
        this.ref.close('Closed using function');
        Swal.fire({
          title: "Archiving complete!",
          text: "Article has been safely archived.",
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
          this.ref.close('Closed using function');
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

  removeAuthor(event: Event) {
    let targetElement = event.target;

    // Get the author div
    let element = ((targetElement as HTMLElement).parentNode)?.parentNode;
    element?.parentNode?.removeChild(element);
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
    // this.values[index] = $event.target.value;
    console.log($event)
  }

  isMaxLimitReached(): boolean {
    return this.values.length >= 3;
  }
  // ----- END OF AUTHORS ----- //
  
  protected updateBox() {
    this.editForm.patchValue({
      authors: JSON.stringify(this.values)
    });

    if(this.editForm.valid) {
      
      // pass datas to formdata to allow sending of files
      let form = new FormData();
      
      Object.entries(this.editForm.value).forEach(([key, value]: [string, any]) => {
        if(value != '' && value != null)
          form.append(key, value);
      });

      this.articleService.updateRecord(this.data.details, form).subscribe({
        next: (res: any) => {
          Swal.fire({
            title: 'Success',
            text: "Article of accession " + form.get('accession') + " has been successfully updated!",
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