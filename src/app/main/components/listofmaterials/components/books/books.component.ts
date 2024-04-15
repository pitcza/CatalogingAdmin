import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

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
import { DeletematPopupComponent } from '../deletemat-popup/deletemat-popup.component';

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
    MatCardModule
  ],
})
export class BooksComponent implements AfterViewInit {
  displayedColumns: string[] = ['dateadd', 'booktitle', 'author', 'location', 'copyright', 'issue', 'action'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator) paginatior !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    private router: Router,
    private paginatorIntl: MatPaginatorIntl, 
    private elementRef: ElementRef, 
    private changeDetectorRef: ChangeDetectorRef,
    private dialog: MatDialog
  ) {
  this.paginator = new MatPaginator(this.paginatorIntl, this.changeDetectorRef);
  }

  ngOnInit(){
    //console.log('This is init method');
  }

  // SWEETALERT DELETE POPUP

  confirmBox(){
  Swal.fire({
    title: 'Are you sure want to delete this material?',
    text: 'You will not be able to recover this book!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: "#AB0E0E",
    cancelButtonColor: "#777777",
    confirmButtonText: 'Delete',
    cancelButtonText: 'Cancel',
  }).then((result) => {
    if (result.value) {
      Swal.fire(
        'Deleted!',
        'The book has been deleted.',
        'success'
      )
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire(
        'Cancelled',
        'The book is safe.',
        'error'
      )
    }
  })
}



  // POP UPS
  showPopup: boolean = false;

  togglePopup() {
    this.showPopup = !this.showPopup;
  }

  closePopup() {
    this.showPopup = this.showPopup;
  }

  redirectToListPage() {
    this.router.navigate(['main/academicprojects/books']); 
  }


  editPopup(code: any) {
    this.Openpopup(code, 'Edit Book', EditBookComponent);
  }

  deletePopup(code: any) {
    this.Openpopup(code, 'Delete Book', DeletematPopupComponent);
  }

  detailsPopup(code: any) {
    this.Openpopup(code, 'Book Details', BookDetailsPopupComponent);
  }

  Openpopup(code: any, title: any,component:any) {
    var _popup = this.dialog.open(component, {
      width: '40%',
      enterAnimationDuration: '100ms',
      exitAnimationDuration: '100ms',
      data: {
        title: title,
        code: code
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

const ELEMENT_DATA: PeriodicElement[] = [
  {dateadd: 'January 01, 2024', booktitle: 'Sample Title One', author: 'Czarina Arellano', location: 'FIL', copyright: '2017', issue: 'ewan', action: 'ewan'},
  {dateadd: 'January 01, 2024', booktitle: 'Sample Title Ewan One Two Three', author: 'Pauleen Dalida', location: 'FOR', copyright: '2017', issue: 'ewan din', action: 'ewan'},
  {dateadd: 'January 01, 2024', booktitle: 'Sample Title One', author: 'Czarina Arellano', location: 'FIL', copyright: '2017', issue: 'ewan', action: 'ewan'},
  {dateadd: 'January 01, 2024', booktitle: 'Sample Title Ewan One Two Three', author: 'Pauleen Dalida', location: 'FOR', copyright: '2017', issue: 'ewan din', action: 'ewan'},
  {dateadd: 'January 01, 2024', booktitle: 'Sample Title One', author: 'Czarina Arellano', location: 'FIL', copyright: '2017', issue: 'ewan', action: 'ewan'},
  {dateadd: 'January 01, 2024', booktitle: 'Sample Title Ewan One Two Three', author: 'Pauleen Dalida', location: 'FOR', copyright: '2017', issue: 'ewan din', action: 'ewan'},
  {dateadd: 'January 01, 2024', booktitle: 'Sample Title One', author: 'Czarina Arellano', location: 'FIL', copyright: '2017', issue: 'ewan', action: 'ewan'},
  {dateadd: 'January 01, 2024', booktitle: 'Sample Title Ewan One Two Three', author: 'Pauleen Dalida', location: 'FOR', copyright: '2017', issue: 'ewan din', action: 'ewan'},
  {dateadd: 'January 01, 2024', booktitle: 'Sample Title One', author: 'Czarina Arellano', location: 'FIL', copyright: '2017', issue: 'ewan', action: 'ewan'},
  {dateadd: 'January 01, 2024', booktitle: 'Sample Title Ewan One Two Three', author: 'Pauleen Dalida', location: 'FOR', copyright: '2017', issue: 'ewan din', action: 'ewan'},
  {dateadd: 'January 01, 2024', booktitle: 'Sample Title One', author: 'Czarina Arellano', location: 'FIL', copyright: '2017', issue: 'ewan', action: 'ewan'},
  {dateadd: 'January 01, 2024', booktitle: 'Sample Title Ewan One Two Three', author: 'Pauleen Dalida', location: 'FOR', copyright: '2017', issue: 'ewan din', action: 'ewan'},
  {dateadd: 'January 01, 2024', booktitle: 'Sample Title One', author: 'Czarina Arellano', location: 'FIL', copyright: '2017', issue: 'ewan', action: 'ewan'},
  {dateadd: 'January 01, 2024', booktitle: 'Sample Title Ewan One Two Three', author: 'Pauleen Dalida', location: 'FOR', copyright: '2017', issue: 'ewan din', action: 'ewan'},
  {dateadd: 'January 01, 2024', booktitle: 'Sample Title One', author: 'Czarina Arellano', location: 'FIL', copyright: '2017', issue: 'ewan', action: 'ewan'},
  {dateadd: 'January 01, 2024', booktitle: 'Sample Title Ewan One Two Three', author: 'Pauleen Dalida', location: 'FOR', copyright: '2017', issue: 'ewan din', action: 'ewan'},
  {dateadd: 'January 01, 2024', booktitle: 'Sample Title One', author: 'Czarina Arellano', location: 'FIL', copyright: '2017', issue: 'ewan', action: 'ewan'},
  {dateadd: 'January 01, 2024', booktitle: 'Sample Title Ewan One Two Three', author: 'Pauleen Dalida', location: 'FOR', copyright: '2017', issue: 'ewan din', action: 'ewan'},
  {dateadd: 'January 01, 2024', booktitle: 'Sample Title One', author: 'Czarina Arellano', location: 'FIL', copyright: '2017', issue: 'ewan', action: 'ewan'},
  {dateadd: 'January 01, 2024', booktitle: 'Sample Title Ewan One Two Three', author: 'Pauleen Dalida', location: 'FOR', copyright: '2017', issue: 'ewan din', action: 'ewan'},
  {dateadd: 'January 01, 2024', booktitle: 'Sample Title One', author: 'Czarina Arellano', location: 'FIL', copyright: '2017', issue: 'ewan', action: 'ewan'},
  {dateadd: 'January 01, 2024', booktitle: 'Sample Title Ewan One Two Three', author: 'Pauleen Dalida', location: 'FOR', copyright: '2017', issue: 'ewan din', action: 'ewan'},
  {dateadd: 'January 01, 2024', booktitle: 'Sample Title One', author: 'Czarina Arellano', location: 'FIL', copyright: '2017', issue: 'ewan', action: 'ewan'},
  {dateadd: 'January 01, 2024', booktitle: 'Sample Title Ewan One Two Three', author: 'Pauleen Dalida', location: 'FOR', copyright: '2017', issue: 'ewan din', action: 'ewan'},
];

