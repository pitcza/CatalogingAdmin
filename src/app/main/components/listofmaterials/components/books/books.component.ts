import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../../../services/data.service';
import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
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
import { MatSort } from '@angular/material/sort';

import { EditBookComponent } from '../edit-book/edit-book.component';
import { BookDetailsPopupComponent } from '../book-details-popup/book-details-popup.component';
import { DataService } from '../../../../../services/data.service';

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
    MatCardModule,
    DatePipe,
    CommonModule
  ],
})

export class BooksComponent implements OnInit{

  constructor(
    private ds: DataService
  ) { }

  protected books: any;
  
export class BooksComponent implements AfterViewInit {
  displayedColumns: string[] = ['dateadd', 'booktitle', 'author', 'location', 'copyright', 'issue', 'action'];
  dataSource:any = null;

  @ViewChild(MatPaginator, {static:true}) paginator: MatPaginator;
  @ViewChild(MatPaginator, {static:true}) paginatior !: MatPaginator;
  @ViewChild(MatSort, {static:true}) sort !: MatSort;

  ngAfterViewInit() {
    this.ds.get('books', '').subscribe({
      next: (res: any) =>  {
        // this.dataSource = new MatTableDataSource(res);
        this.dataSource = new MatTableDataSource<PeriodicElement>(res);
        this.dataSource.paginator = this.paginator;
      },
      error: (err: any) => console.log(err)
    });

    this.ds.get('books/locations', '').subscribe({
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
    this.ds.get('books', '').subscribe({
      next: (res: any) => this.dataSource = new MatTableDataSource(res),
      error: (err: any) => console.log(err)
    });

    this.ds.get('books/locations', '').subscribe({
      next: (res: any) => this.locations = res,
      error: (err: any) => console.log(err)
    });
  }

  // SWEETALERT ARCHIVE POPUP

  archiveBox(){
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
      Swal.fire({
        title: "Archiving complete!",
        text: "Book has been safely archived.",
        icon: "success"
      });
    }
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

  editPopup(code: any) {
    this.Openpopup(code, 'Edit Book', EditBookComponent);
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
    });
  }


  // DATA FOR FILTERING
  

}

export interface PeriodicElement {
  dateadd: string;
  booktitle: string;
  author: string;
  location: string;
  copyright: string;
  issue: string;
  action: string;
}

// const ELEMENT_DATA: PeriodicElement[] = [
//   {dateadd: 'January 01, 2024', booktitle: 'Sample Title One', author: 'Czarina Arellano', location: 'FIL', copyright: '2017', issue: 'ewan', action: 'ewan'},
//   {dateadd: 'January 01, 2024', booktitle: 'Sample Title Ewan One Two Three', author: 'Pauleen Dalida', location: 'FOR', copyright: '2017', issue: 'ewan din', action: 'ewan'},
//   {dateadd: 'January 01, 2024', booktitle: 'Sample Title One', author: 'Czarina Arellano', location: 'FIL', copyright: '2017', issue: 'ewan', action: 'ewan'},
//   {dateadd: 'January 01, 2024', booktitle: 'Sample Title Ewan One Two Three', author: 'Pauleen Dalida', location: 'FOR', copyright: '2017', issue: 'ewan din', action: 'ewan'},
//   {dateadd: 'January 01, 2024', booktitle: 'Sample Title One', author: 'Czarina Arellano', location: 'FIL', copyright: '2017', issue: 'ewan', action: 'ewan'},
//   {dateadd: 'January 01, 2024', booktitle: 'Sample Title Ewan One Two Three', author: 'Pauleen Dalida', location: 'FOR', copyright: '2017', issue: 'ewan din', action: 'ewan'},
//   {dateadd: 'January 01, 2024', booktitle: 'Sample Title One', author: 'Czarina Arellano', location: 'FIL', copyright: '2017', issue: 'ewan', action: 'ewan'},
//   {dateadd: 'January 01, 2024', booktitle: 'Sample Title Ewan One Two Three', author: 'Pauleen Dalida', location: 'FOR', copyright: '2017', issue: 'ewan din', action: 'ewan'},
//   {dateadd: 'January 01, 2024', booktitle: 'Sample Title One', author: 'Czarina Arellano', location: 'FIL', copyright: '2017', issue: 'ewan', action: 'ewan'},
//   {dateadd: 'January 01, 2024', booktitle: 'Sample Title Ewan One Two Three', author: 'Pauleen Dalida', location: 'FOR', copyright: '2017', issue: 'ewan din', action: 'ewan'},
//   {dateadd: 'January 01, 2024', booktitle: 'Sample Title One', author: 'Czarina Arellano', location: 'FIL', copyright: '2017', issue: 'ewan', action: 'ewan'},
//   {dateadd: 'January 01, 2024', booktitle: 'Sample Title Ewan One Two Three', author: 'Pauleen Dalida', location: 'FOR', copyright: '2017', issue: 'ewan din', action: 'ewan'},
//   {dateadd: 'January 01, 2024', booktitle: 'Sample Title One', author: 'Czarina Arellano', location: 'FIL', copyright: '2017', issue: 'ewan', action: 'ewan'},
//   {dateadd: 'January 01, 2024', booktitle: 'Sample Title Ewan One Two Three', author: 'Pauleen Dalida', location: 'FOR', copyright: '2017', issue: 'ewan din', action: 'ewan'},
//   {dateadd: 'January 01, 2024', booktitle: 'Sample Title One', author: 'Czarina Arellano', location: 'FIL', copyright: '2017', issue: 'ewan', action: 'ewan'},
//   {dateadd: 'January 01, 2024', booktitle: 'Sample Title Ewan One Two Three', author: 'Pauleen Dalida', location: 'FOR', copyright: '2017', issue: 'ewan din', action: 'ewan'},
//   {dateadd: 'January 01, 2024', booktitle: 'Sample Title One', author: 'Czarina Arellano', location: 'FIL', copyright: '2017', issue: 'ewan', action: 'ewan'},
//   {dateadd: 'January 01, 2024', booktitle: 'Sample Title Ewan One Two Three', author: 'Pauleen Dalida', location: 'FOR', copyright: '2017', issue: 'ewan din', action: 'ewan'},
//   {dateadd: 'January 01, 2024', booktitle: 'Sample Title One', author: 'Czarina Arellano', location: 'FIL', copyright: '2017', issue: 'ewan', action: 'ewan'},
//   {dateadd: 'January 01, 2024', booktitle: 'Sample Title Ewan One Two Three', author: 'Pauleen Dalida', location: 'FOR', copyright: '2017', issue: 'ewan din', action: 'ewan'},
//   {dateadd: 'January 01, 2024', booktitle: 'Sample Title One', author: 'Czarina Arellano', location: 'FIL', copyright: '2017', issue: 'ewan', action: 'ewan'},
//   {dateadd: 'January 01, 2024', booktitle: 'Sample Title Ewan One Two Three', author: 'Pauleen Dalida', location: 'FOR', copyright: '2017', issue: 'ewan din', action: 'ewan'},
//   {dateadd: 'January 01, 2024', booktitle: 'Sample Title One', author: 'Czarina Arellano', location: 'FIL', copyright: '2017', issue: 'ewan', action: 'ewan'},
//   {dateadd: 'January 01, 2024', booktitle: 'Sample Title Ewan One Two Three', author: 'Pauleen Dalida', location: 'FOR', copyright: '2017', issue: 'ewan din', action: 'ewan'},
// ];

