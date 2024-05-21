import { Component, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

import Swal from 'sweetalert2';

import { MatPaginator, MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ChangeDetectorRef } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, MatSortModule } from '@angular/material/sort';

import { EditBookComponent } from '../edit-book/edit-book.component';
import { BookDetailsPopupComponent } from '../book-details-popup/book-details-popup.component';
import { DataService } from '../../../../../services/data.service';
import { get } from 'http';
import { filter } from 'rxjs';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrl: './books.component.scss',
  standalone: true,
  imports: [
    MatCardModule,
    MatTableModule, 
    MatPaginatorModule, 
    MatFormFieldModule, 
    MatSortModule,
    DatePipe,
    CommonModule
  ],
})

export class BooksComponent implements OnInit {
  displayedColumns: string[] = ['title', 'author', 'location', 'copyright', 'action'];
  dataSource:any = null;
  materials: any = null;

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
    this.ds.get('books').subscribe({
      next: (res: any) =>  {
        console.log(res)
        this.materials = res;        
        this.dataSource = new MatTableDataSource<BookElement, MatPaginator>(this.materials);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: (err: any) => console.log(err)
    });
  }

  // Filtering 
  applyFilter() {

    const search = (document.getElementById('search-book') as HTMLInputElement).value;

      const titleFilterPredicate = (data: BookElement, search: string): boolean => {
        return data.title.toLowerCase().includes(search.toLowerCase());
      }

      const authorFilterPredicate = (data: BookElement, search: string): boolean => {
        return data.authors.some((x: any) => {
          return x.toLowerCase().trim().includes(search.toLowerCase().trim());
        });
      }

      const locationFilterPredicate = (data: BookElement, search: string): boolean => {
        return data.location.location.toLowerCase().includes(search.toLowerCase());
      }

      const copyrightFilterPredicate = (data: BookElement, search: string): boolean => {
        return data.copyright == search;
      }

      // const start = (document.getElementById('datepicker-start') as HTMLInputElement).value;
      // const end = (document.getElementById('datepicker-end') as HTMLInputElement).value;

      // const startFilterPredicate = (data: PeriodicElement, start: string): boolean => {
      //   if(start == '')
      //       return true;
      //   return Date.parse(data.create_date) >= Date.parse(start);
      // }

      // const endFilterPredicate = (data: PeriodicElement, end: string): boolean => {
      //   if(end == '')
      //       return true;
      //   return Date.parse(data.create_date) <= Date.parse(end);
      // }

      const filterPredicate = (data: BookElement): boolean => {
        return (titleFilterPredicate(data, search) ||
               authorFilterPredicate(data, search) ||
               locationFilterPredicate(data, search) ||
               copyrightFilterPredicate(data, search)) 
              //  (startFilterPredicate(data, search) && endFilterPredicate(data,search))
      };
      
      this.dataSource.filterPredicate = filterPredicate;
      this.dataSource.filter = search;
  }

  // SWEETALERT ARCHIVE POPUP
  archiveBox(id: any){
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
        this.ds.delete('books/process/' + id).subscribe({
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
        details: data
      }
    });
    _popup.afterClosed().subscribe(result => {
      this.redirectToListPage();
      if(result == 'Changed Data') {
        this.getData()
      }
    });
  }
}

export interface BookElement {
  created_at: Date;
  title: string;
  authors: any;
  location: any;
  copyright: string;
  date_published: Date;
  volume: number;
  [key: string]: any;
}