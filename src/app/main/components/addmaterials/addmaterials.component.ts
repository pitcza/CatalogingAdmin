import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../../services/data.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators, ValidationErrors } from '@angular/forms';
import { BookService } from '../../../services/materials/book/book.service';
import { share } from 'rxjs';
import { PeriodicalService } from '../../../services/materials/periodical/periodical.service';
import { ArticleService } from '../../../services/materials/article/article.service';
import { kMaxLength } from 'buffer';

@Component({
  selector: 'app-addmaterials',
  templateUrl: './addmaterials.component.html',
  styleUrls: ['./addmaterials.component.scss']
})
export class AddmaterialsComponent implements OnInit {

  bookForm: FormGroup;
  periodicalForm: FormGroup;
  articleForm: FormGroup;
  bookImage: any = null;
  periodicalImage: any = null;

  constructor(
    private formBuilder: FormBuilder,
    private bookService: BookService,
    private periodicalService: PeriodicalService,
    private articleService: ArticleService
  ) {
    let sharedFields = {
      accession: ['', Validators.required],
      title: ['', [Validators.required, Validators.maxLength(255)]],
      authors: ['', Validators.required],
      publisher: ['', Validators.required],
      remarks: [''],
      pages: ['', Validators.required],
    };

    this.bookForm = formBuilder.group(Object.assign({}, sharedFields, {
      copyright: [2024, Validators.required],
      volume: [''],
      edition: [''],
      acquired_date: ['', Validators.required],
      source_of_fund: ['Purchased', Validators.required],
      price: [''],
      location: ['ABCOMM', Validators.required],
      call_number: ['', Validators.required],
      author_number: ['', Validators.required],
      copies: [1, Validators.required]
    }));

    this.periodicalForm = formBuilder.group(Object.assign({}, sharedFields, {
      periodical_type: ['0', Validators.required],
      volume: ['', Validators.required],
      issue: ['', Validators.required],
      language: ['English', Validators.required],
      acquired_date: ['', Validators.required],
      date_published: ['', Validators.required],
      copyright: [2024, Validators.required]
    }));

    this.articleForm = formBuilder.group(Object.assign({}, sharedFields, {
      periodical_type: ['0', Validators.required],
      abstract: ['', Validators.required],
      volume: ['', Validators.required],
      issue: ['', Validators.required],
      language: ['English', Validators.required],
      subject: ['', Validators.required],
      date_published: ['', Validators.required],
    }));
  }

  // form select initializers
  protected locations: any = null;
  currentYear = new Date().getFullYear();
  year: number[] = [];

  values = [''];
  authors: string[] = [''];
  

  ngOnInit(): void {
    this.getLocations();

    for (let i = 1991; i <= this.currentYear; i++) {
      this.year.push(i);
    }
  }

  protected getLocations() {
    this.bookService.getLocations().subscribe((res: any) => {
      this.locations = res;
    })
  }

  // ----- MULTIPLE AUTHORS FUNCTION -----//
  removevalue(i: any) {
    this.values.splice(i, 1);
  }

  addvalue() {
    if (this.values.length < 3) {
      this.values.push('');
    }
  }

  updateValue(event: Event, i: number) {
    let input = event.target as HTMLInputElement;
    this.values[i] = input.value;
  }

  isMaxLimitReached(): boolean {
    return this.values.length >= 3;
  }

  addAuthor() {
    this.authors = [...this.authors, ''];
  }

  removeAuthor(index: number) {
    this.authors.splice(index, 1);
    this.authors = [...this.authors];
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }

  emptyValues() {}

  changedFunds(event: Event) {
    let price = (document.getElementById('funds') as HTMLInputElement).value;
    if(price == 'Purchased'){
      this.bookForm.get('price')?.enable();
      this.bookForm.get('price')?.addValidators(Validators.required);
    } else {
      this.bookForm.get('price')?.disable();
      this.bookForm.get('price')?.clearValidators();
    }
  }

  imageUpload(event: Event, type: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      if(type == 'book') {
        this.bookImage = file;
      } else if (type == 'periodical') {
        this.periodicalImage = file;
      }
    }
  }

  protected materialSubmit(type: string) {
    switch(type) {
      case 'book':
        var addForm = this.bookForm;
        break;

      case 'periodical':
        var addForm = this.periodicalForm;
        break;

      case 'article':
        var addForm = this.articleForm;
        break;
      
      default:
        return;
    }

    addForm.patchValue({
      authors: JSON.stringify(this.values)
    });

    if(addForm.valid) {
      
      // pass datas to formdata to allow sending of files
      let form = new FormData();
      
      Object.entries(addForm.value).forEach(([key, value]: [string, any]) => {
        if(value != '' && value != null)
          form.append(key, value);
      });

      if(type == 'book') {
        if(this.bookImage) {
          form.append('image_url', this.bookImage);
        }
      } else if(type == 'periodical') {
        if(this.periodicalImage) {
          form.append('image_url', this.periodicalImage);
        }
      }

      let formTitle = '';
      formTitle += form.get('title');

      if(type == 'book') {
        this.bookService.addRecord(form).subscribe({
          next: (res: any) => {
            this.successMessage(formTitle)
            },
          error: (err: any) => {
            this.serverErrors();
          }
        });
      } else if(type == 'periodical') {
        this.periodicalService.addRecord(form).subscribe({
          next: (res: any) => {
            this.successMessage(formTitle)
            },
          error: (err: any) => {
            this.serverErrors();
          }
        });
      } else if(type == 'article') {
        this.articleService.addRecord(form).subscribe({
          next: (res: any) => {
            this.successMessage(formTitle)
            },
          error: (err: any) => {
            this.serverErrors();
          }
        });
      }
    } else {
      this.displayErrors(type);
    }

  }

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
  
  displayErrors(type: string) {
    if(type == 'book') {
      var form = this.bookForm;
    } else if(type == 'periodical') {
      var form = this.periodicalForm;
    } else if(type == 'article') {
      var form = this.articleForm;
    } else {
      return;
    }

    let maxLengthFields = '';
    let requiredFields = '';
    Object.keys(form.controls).forEach(key => {
      const control = form.get(key);
      if (control && control.errors) {
        const controlErrors = control.errors;
        Object.keys(controlErrors).forEach(errorKey => {
          switch (errorKey) {
            case 'required':
              requiredFields += `${key}, `;
              break;

            case 'maxlength':
              maxLengthFields += `${key}, `;
              break;

            default:
              break;
          }
        });
      }
    });

    let errorText = '';
    console.log(requiredFields)
    if(requiredFields.length > 1) {
      errorText = errorText + '<b>Required Fields: </b>' + requiredFields.substring(0, requiredFields.length - 2) + '<br>';
    } else if(maxLengthFields.length > 1) {
      errorText += '<b>Fields Exceeding Allowed Lengths: </b>' + maxLengthFields.substring(0, maxLengthFields.length - 2);
    }

    Swal.fire({
      title: 'Oops! Submission Error!',
      html: errorText,
      icon: 'error',
      confirmButtonText: 'Close',
      confirmButtonColor: "#777777",
    });
  }
}
