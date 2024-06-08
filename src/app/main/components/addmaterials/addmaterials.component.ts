import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../../services/data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-addmaterials',
  templateUrl: './addmaterials.component.html',
  styleUrls: ['./addmaterials.component.scss']
})
export class AddmaterialsComponent implements OnInit {
  constructor(private ds: DataService) {}

  protected locations: any = null;
  currentYear = new Date().getFullYear();
  year: number[] = [];
  isPurchased = true;
  tags = [{ name: 'English' }, { name: 'Educational' }, { name: 'Philippine' }];
  newTag = '';
  separatorKeysCodes = [13, 188]; // ENTER, COMMA

  values = [''];
  authors: string[] = [''];

  ngOnInit(): void {
    this.getLocations();
    this.bookSubmit();
    this.periodicalSubmit();
    this.articleSubmit();

    for (let i = 1990; i <= this.currentYear; i++) {
      this.year.push(i);
    }
  }

  // Tag management methods
  addTag() {
    if (this.newTag && this.newTag.trim()) {
      this.tags.push({ name: this.newTag.trim() });
      this.newTag = '';
    }
  }

  removeTag(tag: { name: string }) {
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  handleKeydown(event: KeyboardEvent) {
    if (this.separatorKeysCodes.includes(event.keyCode)) {
      this.addTag();
      event.preventDefault();
    }
  }

  editTag(tag: { name: string }) {
    const newName = prompt('Edit tagname', tag.name);
    if (newName !== null) {
      tag.name = newName.trim() || tag.name;
    }
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
    this.isPurchased = price == 'Purchased';
  }

  protected bookSubmit() {
    var form = document.getElementById('book-form') as HTMLFormElement;

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      let valid = true;
      let validFile = true;
      const fields = ['title', 'author', 'copyright', 'pages', 'acquired_date', 'source_of_fund', 'location_id', 'call_number', 'copies'];
      const elements = form.elements;
      let formData = new FormData();

      for (let i = 0; i < elements.length; i++) {
        const element = elements[i] as HTMLInputElement;

        if (element.tagName === 'INPUT' || element.tagName === 'SELECT' && element.id !== 'submit') {
          if (element.type !== 'file' && element.value !== '' && element.name != 'author') {
            formData.append(element.name, element.value);
          } else if (element.type === 'file' && element.files && element.files.length > 0) {
            const file = element.files[0];
            if (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png') {
              formData.append(element.name, element.files[0]);
            } else {
              validFile = false;
            }
          }

          if (fields.includes(element.name) && element.value == '') {
            valid = false;
            element.style.borderColor = 'red';
          } else {
            element.style.borderColor = 'black';
          }
        }
      }

      formData.append('authors', JSON.stringify(this.values));

      if (valid && validFile) {
        this.ds.post('books/process', formData).subscribe({
          next: (res: any) => {
            Swal.fire({
              title: 'Success',
              text: formData.get('title') + " has been added successfully",
              icon: 'success',
              confirmButtonText: 'Close',
              confirmButtonColor: "#777777",
            });
          },
          error: (err: any) => {
            Swal.fire({
              title: 'Error',
              text: "Oops an error occured",
              icon: 'error',
              confirmButtonText: 'Close',
              confirmButtonColor: "#777777",
            });
          }
        });
      } else if (!validFile) {
        Swal.fire({
          title: 'Oops! Error on form',
          text: 'Invalid image. Must be of type png, jpeg, or jpg.',
          icon: 'error',
          confirmButtonText: 'Close',
          confirmButtonColor: "#777777",
        });
      } else {
        Swal.fire({
          title: 'Oops! Error on form',
          text: 'Please check if required fields have values',
          icon: 'error',
          confirmButtonText: 'Close',
          confirmButtonColor: "#777777",
        });
      }
    });
  }

  protected getLocations() {
    this.ds.get('books/locations').subscribe((res: any) => {
      this.locations = res;
    });
  }

  protected periodicalSubmit() {
    var form = document.getElementById('periodical-form') as HTMLFormElement;

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const elements = form.elements;
      let formData = new FormData();
      let fields = ['material_type', 'author', 'title', 'issue', 'language', 'receive_date', 'date_published', 'copyright', 'publisher', 'volume', 'pages'];
      let valid = true;
      let validFile = true;

      for (let i = 0; i < elements.length; i++) {
        const element = elements[i] as HTMLInputElement;

        if (element.tagName === 'INPUT' || element.tagName === 'SELECT') {
          if (element.type !== 'file' && element.id !== 'submit' && element.value !== '' && element.name != 'author') {
            formData.append(element.name, element.value);
          } else if (element.type === 'file' && element.files && element.files.length > 0) {
            const file = element.files[0];
            if (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png') {
              formData.append(element.name, element.files[0]);
            } else {
              validFile = false;
            }
          }

          if (fields.includes(element.name) && element.value == '') {
            valid = false;
            element.style.borderColor = 'red';
          } else {
            element.style.borderColor = 'black';
          }
        }
      }

      formData.append('authors', JSON.stringify(this.values));

      if (valid && validFile) {
        this.ds.post('periodicals/process', formData).subscribe({
          next: (res: any) => {
            Swal.fire({
              title: 'Success',
              text: formData.get('title') + " has been added successfully",
              icon: 'success',
              confirmButtonText: 'Close',
              confirmButtonColor: "#777777",
            });
          },
          error: (err: any) => {
            Swal.fire({
              title: 'Error',
              text: "Oops an error occured",
              icon: 'error',
              confirmButtonText: 'Close',
              confirmButtonColor: "#777777",
            });
          }
        });
      } else if (!validFile) {
        Swal.fire({
          title: 'Oops! Error on form',
          text: 'Invalid image. Must be of type png, jpeg, or jpg.',
          icon: 'error',
          confirmButtonText: 'Close',
          confirmButtonColor: "#777777",
        });
      } else {
        Swal.fire({
          title: 'Oops! Error on form',
          text: 'Please check if required fields have values',
          icon: 'error',
          confirmButtonText: 'Close',
          confirmButtonColor: "#777777",
        });
      }
    });
  }

  protected articleSubmit() {
    var form = document.getElementById('article-form') as HTMLFormElement;

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const elements = form.elements;
      let formData = new FormData();
      let fields = ['material_type', 'author', 'title', 'subject', 'abstract', 'issue', 'language', 'receive_date', 'date_published', 'copyright', 'publisher', 'volume', 'pages'];
      let valid = true;

      for (let i = 0; i < elements.length; i++) {
        const element = elements[i] as HTMLInputElement;

        if (element.tagName === 'INPUT' || element.tagName === 'SELECT' || element.tagName === 'TEXTAREA') {
          if (element.type !== 'submit' && element.value !== '') {
            formData.append(element.name, element.value);
          }

          if (fields.includes(element.name) && element.value == '') {
            valid = false;
            element.style.borderColor = 'red';
          } else {
            element.style.borderColor = 'black';
          }
        }
      }

      formData.append('authors', JSON.stringify(this.values));

      if (valid) {
        this.ds.post('articles/process', formData).subscribe({
          next: (res: any) => {
            Swal.fire({
              title: 'Success',
              text: formData.get('title') + " has been added successfully",
              icon: 'success',
              confirmButtonText: 'Close',
              confirmButtonColor: "#777777",
            });
          },
          error: (err: any) => {
            Swal.fire({
              title: 'Error',
              text: "Oops an error occured",
              icon: 'error',
              confirmButtonText: 'Close',
              confirmButtonColor: "#777777",
            });
          }
        });
      } else {
        Swal.fire({
          title: 'Oops! Error on form',
          text: "Please check if required fields have values",
          icon: 'error',
          confirmButtonText: 'Close',
          confirmButtonColor: "#777777",
        });
      }
    });
  }
}
