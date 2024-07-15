import { Component, ViewChild, ElementRef, AfterViewInit, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { DataService } from '../../../../../services/data/data.service';

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
    private ds: DataService
  ) { 
    this.paginator = new MatPaginator(this.paginatorIntl, this.changeDetectorRef);
  }

  protected books: any = null;

  protected getData() {
    this.ds.request('GET', 'materials/books', null).subscribe({
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

    const search = (event.target as HTMLInputElement).value;

    const accessionFilterPredicate = (data: BookElement, search: string): boolean => {
      return data.accession == search;
    }

    const locationFilterPredicate = (data: BookElement, search: string): boolean => {
      if(data.location) return data.location.toLowerCase().includes(search.toLowerCase());
      else return false;
    }

    const copyrightFilterPredicate = (data: BookElement, search: string): boolean => {
      return data.copyright == search;
    }

    const titleFilterPredicate = (data: BookElement, search: string): boolean => {
      return data.title.toLowerCase().includes(search.toLowerCase());
    }

    const authorFilterPredicate = (data: BookElement, search: string): boolean => {
      if(data.authors) {
        return data.authors.some((x: any) => {
          return x.toLowerCase().trim().includes(search.toLowerCase().trim());
        });
      } else return false;      
    }

    const filterPredicate = (data: BookElement): boolean => {
      return (titleFilterPredicate(data, search) ||
              authorFilterPredicate(data, search) ||
              accessionFilterPredicate(data, search) ||
              locationFilterPredicate(data, search) ||
              copyrightFilterPredicate(data, search))
    };
    
    this.dataSource.filterPredicate = filterPredicate;
    this.dataSource.filter = search;
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
        this.ds.request('DELETE', 'materials/archive/' + accession, null).subscribe({
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
      console.log(result)
      this.redirectToListPage();
      if(result == 'Update' || result == 'Archive') {
        this.getData()
      }
    });
  }
}

export interface BookElement {
  accession: string;
  title: string;
  authors: any;
  location: string;
  copyright: string;
}