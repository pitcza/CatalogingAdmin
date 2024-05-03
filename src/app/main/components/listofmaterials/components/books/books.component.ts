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
    MatFormFieldModule,
    MatCardModule,
    MatTableModule, 
    MatPaginatorModule, 
    MatFormFieldModule, 
    MatSortModule,
    MatCardModule,
    DatePipe,
    CommonModule
  ],
})

export class BooksComponent implements OnInit {
  displayedColumns: string[] = ['created_at', 'title', 'author', 'location', 'copyright', 'action'];
  dataSource:any = null;
  materials: any = null;

  @ViewChild(MatPaginator, {static:true}) paginator!: MatPaginator;
  @ViewChild(MatSort, {static:true}) sort!: MatSort;

  ngOnInit() {
    this.ds.get('books').subscribe({
      next: (res: any) =>  {
        this.materials = res;
        console.log(res)
        this.dataSource = new MatTableDataSource<BookElement, MatPaginator>(this.materials);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: (err: any) => console.log(err)
    });

    this.ds.get('books/locations').subscribe({
      next: (res: any) => this.locations = res,
      error: (err: any) => console.log(err)
    });
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
  protected locations: any = null;

  protected getData() {
    this.ds.get('books').subscribe({
      next: (res: any) => this.dataSource = new MatTableDataSource(res),
      error: (err: any) => console.log(err)
    });

    this.ds.get('books/locations').subscribe({
      next: (res: any) => this.locations = res,
      error: (err: any) => console.log(err)
    });

  }

  // Filtering 
  applyFilter(event: Event, type: string) {

    const select = (document.getElementById('filter') as HTMLSelectElement).value;
    const search = (document.getElementById('search') as HTMLInputElement).value;

      const titleFilterPredicate = (data: BookElement, search: string): boolean => {
        return data.title.toLowerCase().includes(search.toLowerCase());
      }

      const authorFilterPredicate = (data: BookElement, search: string): boolean => {
        return data.author.toLowerCase().includes(search.toLowerCase());
      }
      
      const locationFilterPredicate = (data: BookElement, select: string): boolean => {
        return data.location.location === select || select === '';
      }

      const filterPredicate = (data: BookElement): boolean => {
        return (titleFilterPredicate(data, search) ||
               authorFilterPredicate(data, search)) &&
               locationFilterPredicate(data, select);
      };
      
      this.dataSource.filterPredicate = filterPredicate;
      if(type === 'filter')
        this.dataSource.filter = select;
      else if(type === 'search')
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
            });
            this.getData();
          },
          error: (err: any) => {
            Swal.fire({
              title: "Error",
              text: "Oops an error occured.",
              icon: "error"
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
    console.log(data)
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
    });
  }



}

export interface BookElement {
  created_at: Date;
  title: string;
  author: string;
  location: any;
  copyright: Date;
  date_published: Date;
  volume: number;
  [key: string]: any;
}