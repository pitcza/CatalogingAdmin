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

  bookSubmit = false; periodicalSubmit = false; articleSubmit = false;
  bookForm: FormGroup;
  periodicalForm: FormGroup;
  articleForm: FormGroup;
  bookImage: any = null;
  periodicalImage: any = null;
  bookImageUrl: string | ArrayBuffer | null = null;  // Add this line
  periodicalImageUrl: string | ArrayBuffer | null = null;  // Add this line

  constructor(
    private formBuilder: FormBuilder,
    private bookService: BookService,
    private periodicalService: PeriodicalService,
    private articleService: ArticleService
  ) {
    let sharedFields = {
      accession: ['', [Validators.required, Validators.maxLength(20)]],
      title: ['', [Validators.required, Validators.maxLength(150)]],
      authors: ['', [Validators.required, Validators.maxLength(255)]],
      publisher: ['', [Validators.required, Validators.maxLength(100)]],
      remarks: ['', Validators.maxLength(255)],
      pages: ['', [Validators.required, Validators.maxLength(20)]],
    };

    this.bookForm = formBuilder.group(Object.assign({}, sharedFields, {
      copyright: [2024, Validators.required],
      volume: ['', Validators.maxLength(50)],
      edition: ['', Validators.maxLength(50)],
      acquired_date: ['', Validators.required],
      source_of_fund: ['Purchased', Validators.required],
      price: ['', [Validators.required, Validators.min(1)]],
      location: ['ABCOMM', Validators.required],
      call_number: ['', [Validators.required, Validators.maxLength(20)]],
      author_number: ['', [Validators.required, Validators.maxLength(20)]],
      copies: [1, [Validators.required, Validators.min(1)]]
    }));
    
    this.bookForm.get('accession')?.addValidators(Validators.pattern('^[0-9]+$'));
    this.bookForm.updateValueAndValidity();

    this.periodicalForm = formBuilder.group(Object.assign({}, sharedFields, {
      periodical_type: ['0', Validators.required],
      volume: ['', [Validators.required, Validators.maxLength(50)]],
      issue: ['', [Validators.required, Validators.maxLength(50)]],
      language: ['English', Validators.required],
      acquired_date: ['', Validators.required],
      date_published: ['', Validators.required],
      copyright: [2024, Validators.required]
    }));

    this.articleForm = formBuilder.group(Object.assign({}, sharedFields, {
      periodical_type: ['0', Validators.required],
      abstract: ['', [Validators.required, Validators.maxLength(4096)]],
      volume: ['', [Validators.required, Validators.maxLength(50)]],
      issue: ['', [Validators.required, Validators.maxLength(50)]],
      language: ['English', Validators.required],
      subject: ['', [Validators.required, Validators.maxLength(255)]],
      date_published: ['', Validators.required]
    }));
  }

  // form select initializers
  protected locations: any = null;
  currentYear = new Date().getFullYear();
  year: number[] = [];

  bookAuthors = [''];
  periodicalAuthors = [''];
  articleAuthors = [''];


  ngOnInit(): void {
    this.getLocations();

    for (let i = 1991; i <= this.currentYear; i++) {
      this.year.push(i);
    }
  }

  protected getLocations() {
    this.bookService.getLocations().subscribe((res: any) => {
      this.locations = res;
    });
  }

  // MULTIPLE AUTHORS FUNCTION     

  removevalue(i: any, type: string) {
    this.getAuthorSet(type).splice(i, 1);
  }

  addvalue(type: string) {
    if (this.getAuthorSet(type).length < 5) {
      this.getAuthorSet(type).push('');
    }
  }

  updateValue(event: Event, i: number, type: string) {
    let input = event.target as HTMLInputElement;
    this.getAuthorSet(type)[i] = input.value;
  }

  isMaxLimitReached(type: string): boolean {
    return this.getAuthorSet(type).length >= 5;
  }
  
  trackByIndex(index: number, item: any): number {
    return index;
  }

  emptyValues() {}

  getAuthorSet(type: string) {
    switch(type){
      case 'book':
        return this.bookAuthors;

      case 'periodical':
        return this.periodicalAuthors;

      case 'article':
        return this.articleAuthors;

      default:
        return [];
    }
  }

  // END OF AUTHORS

  changedFunds(event: Event) {
    let price = (event?.target as HTMLInputElement).value;
    let priceControl = this.bookForm.get('price');
    if(price == 'Purchased'){
      priceControl?.enable();
      priceControl?.addValidators([Validators.required, Validators.min(1)]);
    } else {
      priceControl?.disable();
      priceControl?.clearValidators();
    }
    priceControl?.updateValueAndValidity();
  }

  imageUpload(event: Event, type: string): void {
    const input = event.target as HTMLInputElement;

    // Check if there are files selected
    if (input.files && input.files.length) {
      const file = input.files[0];  // Get the first selected file

      // Check if the selected file is an image
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();  // Create a new FileReader instance

        // Define the onload callback for the FileReader
        reader.onload = () => {
          if (type == 'book') {
            this.bookImageUrl = reader.result;  // Add this line
          } else if (type == 'periodical') {
            this.periodicalImageUrl = reader.result;
          }
        };

        reader.readAsDataURL(file);  // Read the file as a data URL

        if(type == 'book') {
          this.bookImage = file;
        } else if (type == 'periodical') {
          this.periodicalImage = file;
        }

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

  getFormSet(type: string) {
    let dummyForm: FormGroup = this.formBuilder.group({
      key: ['']
    });

    switch(type) {
      case 'book':
        return this.bookForm;

      case 'periodical':
        return this.periodicalForm;

      case 'article':
        return this.articleForm;

      default:
        return dummyForm;
    }
  }

  isInvalid(controlName: string, type: string): boolean {
    const control = this.getFormSet(type).get(controlName);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  invalidAuthor(i: number, type: string) {
    let authorInput = this.getAuthorSet(type)[i];
    let submit = false;
    switch(type) {
      case 'book':
        submit = this.bookSubmit;
        break;

      case 'periodical':
        submit = this.periodicalSubmit;
        break;

      case 'article':
        submit = this.articleSubmit;
        break;
    }

    return (authorInput.length < 1 || authorInput.length > 50) && submit;
  }

  validateAuthors(type: string) {
    let valid = true;
    let isNull = false;
    let isExceeded = false;

    this.getAuthorSet(type).forEach(author => {
      if(author.length > 50) {
        valid = false;
        isExceeded = true;
      }
      
      if(author.length < 1) {
        valid = false;
        isNull = true;
      }
    });

    return {'valid': valid, 'null': isNull, 'maxLength': isExceeded};
  }

  protected materialSubmit(type: string) {

    let addForm = this.getFormSet(type);

    switch(type) {
      case 'book':
        this.bookSubmit = true;
        break;

      case 'periodical':
        this.periodicalSubmit = true;
        break;

      case 'article':
        this.articleSubmit = true;
        break;
    }

    if(this.validateAuthors(type).valid) {
      addForm.patchValue({
        authors: JSON.stringify(this.getAuthorSet(type))
      });
    }

    if(addForm.valid) {
      Swal.fire({
        title: "Are you sure you want to add a new maretial?",
        text: "This action will create a new " + type + ".",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
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
      }
    });
    } else {
      this.markFormGroupTouched(addForm);
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
      scrollbarPadding: false,
      willOpen: () => {
        document.body.style.overflowY = 'scroll';
      },
      willClose: () => {
        document.body.style.overflowY = 'scroll';
      },
    });
  }

  serverErrors() {
    Swal.fire({
      title: 'Oops! Server Side Error!',
      text: 'Please try again later or contact the developers',
      icon: 'error',
      confirmButtonText: 'Close',
      confirmButtonColor: "#777777",
      scrollbarPadding: false,
      willOpen: () => {
        document.body.style.overflowY = 'scroll';
      },
      willClose: () => {
        document.body.style.overflowY = 'scroll';
      },
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
    let minIntFields = '';
    let integerFields = '';
    let required = false;

    Object.keys(form.controls).forEach(key => {
      const control = form.get(key);
      if (control && control.errors) {
        const controlErrors = control.errors;
        Object.keys(controlErrors).forEach(errorKey => {
          switch (errorKey) {
            case 'required':
              required = true;
              break;

            case 'maxlength':
              maxLengthFields += `${key}, `;
              break;

            case 'min':
              minIntFields += `${key}, `;
              break;

            case 'pattern':
              if(controlErrors['pattern']['requiredPattern'] == '^[0-9]+$') {
                integerFields += `${key}, `;
              }
              break;

            default:
              break;
          }
        });
      }
    });

    if(this.validateAuthors(type).maxLength) {
      maxLengthFields += 'authors, '
    }

    let errorText = '';
    
    if(required) {
      errorText += 'Please fill up required fields <br>'
    } 
    
    if(maxLengthFields.length > 0) {
      errorText += 'Exceeds max length: ' + maxLengthFields.substring(0, maxLengthFields.length - 2) + '<br>';
    }

    if(minIntFields.length > 0) {
      errorText += 'Lower than minimum: ' + minIntFields.substring(0, minIntFields.length - 2) + '<br>';
    }

    if(integerFields.length > 0) {
      errorText += 'Should be number type: ' + integerFields.substring(0, integerFields.length - 2) + '<br>';
    }

    Swal.fire({
      title: 'Oops! Invalid Form!',
      html: `<div style="font-weight: 500;">${errorText}</div>`,
      icon: 'error',
      confirmButtonText: 'Close',
      confirmButtonColor: "#777777",
      scrollbarPadding: false,
      willOpen: () => {
        document.body.style.overflowY = 'scroll';
      },
      willClose: () => {
        document.body.style.overflowY = 'scroll';
      },
    });
  }
}
