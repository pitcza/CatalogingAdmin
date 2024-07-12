import { Component, ViewChild, ElementRef, AfterViewInit, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';

import { EditBookComponent } from './edit-book/edit-book.component';
import { BookDetailsPopupComponent } from './book-details-popup/book-details-popup.component';

import { DataService } from '../../../../../services/data.service';
import { get } from 'http';
import { filter } from 'rxjs';
import { BookService } from '../../../../../services/materials/book/book.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrl: './books.component.scss',
  standalone: true,
  imports: [
    MatSortModule,
    MatTableModule,
    MatPaginatorModule, 
    MatFormFieldModule,
    CommonModule
  ],
})

export class BooksComponent implements OnInit {
  displayedColumns: string[] = ['title', 'author', 'location', 'copyright', 'action'];
  dataSource:any = null;
  materials: any = null;
  isLoading = true;

  @ViewChild(MatPaginator, {static:true}) paginator!: MatPaginator;
  @ViewChild(MatSort, {static:true}) sort!: MatSort;

  ngOnInit() {
    this.getData();
  }

  constructor(
    private router: Router,
    private paginatorIntl: MatPaginatorIntl, 
    private elementRef: ElementRef, 
    private changeDetectorRef: ChangeDetectorRef,
    private dialog: MatDialog,
    private bookService: BookService,
    private ds: DataService
  ) { 
    this.paginator = new MatPaginator(this.paginatorIntl, this.changeDetectorRef);
  }

  protected books: any = null;

  protected getData() {
    this.bookService.getAll().subscribe({
      next: (res: any) =>  {
        this.materials = res;        
        this.dataSource = new MatTableDataSource<BookElement, MatPaginator>(this.materials);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: (err: any) => console.log(err)
    });
  }

  // Filtering 
  applyFilter(event: Event) {
      this.dataSource.filter = (event.target as HTMLInputElement).value;
  }

  // SWEETALERT ARCHIVE POPUP
  archiveBox(accession: any){
    Swal.fire({
      title: "Archive Book",
      text: "Are you sure want to archive this book?",
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
        this.bookService.deleteRecord(accession).subscribe({
          next: (res: any) => {
            Swal.fire({
              title: "Archiving complete!",
              text: "Book has been safely archived.",
              icon: "success",
              confirmButtonText: 'Close',
              confirmButtonColor: "#777777",
              scrollbarPadding: false
            });
            this.getData();
          },
          error: (err: any) => {
            Swal.fire({
              title: "Error",
              text: "Oops an error occured.",
              icon: "error",
              scrollbarPadding: false
            });
            console.log(err);
          }
        });
      };
    });
  }

  // POP UPS
  showPopup: boolean = false;

  closePopup() {
    this.showPopup = this.showPopup;
  }

  redirectToListPage() {
    this.router.navigate(['main/listofmaterials/books']); 
  }

  editPopup(data: any) {
    this.Openpopup(data, 'Edit Book', EditBookComponent);
    
  }

  detailsPopup(data: any) {
    this.Openpopup(data, 'Book Details', BookDetailsPopupComponent);
  }

  Openpopup(data: any, title: any,component:any) {
    var _popup = this.dialog.open(component, {
      width: '40%',
      enterAnimationDuration: '100ms',
      exitAnimationDuration: '100ms',
      data: {
        title: title,
        accession: data
      }
    });
    _popup.afterClosed().subscribe(result => {
      this.redirectToListPage();
      if(result == 'Update' || result == 'Archive') {
        this.getData()
      }
    });
  }
}

export interface BookElement {
  title: string;
  authors: any;
  location: string;
  copyright: string;
}