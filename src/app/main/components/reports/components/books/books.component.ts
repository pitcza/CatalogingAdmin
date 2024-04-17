import { AfterViewInit, Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import { MatPaginator, MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { ChangeDetectorRef } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss'], 
  standalone: true,
  imports: [

    MatPaginatorModule,
    MatTableModule,
    MatFormFieldModule,
    MatCardModule

  ],
})
export class BooksComponent implements AfterViewInit {
  displayedColumns: string[] = ['dateadd', 'booktitle', 'author', 'location', 'copyright', 'issue'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator) paginatior !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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

}

export interface PeriodicElement {
  dateadd: string;
  booktitle: string;
  author: string;
  location: string;
  copyright: string;
  issue: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {dateadd: 'April 15, 2024', booktitle: 'One Piece', author: 'Eiichiro Oda', location: 'FIL', copyright: '1999', issue: 'sobrang haba'}, 
  {dateadd: 'April 16, 2024', booktitle: 'Ang alamat ng Marupok', author: 'Sempre ako na yun', location: 'FIL', copyright: '2003', issue: 'for marupok only'},
  {dateadd: 'April 15, 2024', booktitle: 'One Piece', author: 'Eiichiro Oda', location: 'FIL', copyright: '1999', issue: 'sobrang haba'}, 
  {dateadd: 'April 16, 2024', booktitle: 'Ang alamat ng Marupok', author: 'Sempre ako na yun', location: 'FIL', copyright: '2003', issue: 'for marupok only'},
  {dateadd: 'April 15, 2024', booktitle: 'One Piece', author: 'Eiichiro Oda', location: 'FIL', copyright: '1999', issue: 'sobrang haba'}, 
  {dateadd: 'April 16, 2024', booktitle: 'Ang alamat ng Marupok', author: 'Sempre ako na yun', location: 'FIL', copyright: '2003', issue: 'for marupok only'},
  {dateadd: 'April 15, 2024', booktitle: 'One Piece', author: 'Eiichiro Oda', location: 'FIL', copyright: '1999', issue: 'sobrang haba'}, 
  {dateadd: 'April 16, 2024', booktitle: 'Ang alamat ng Marupok', author: 'Sempre ako na yun', location: 'FIL', copyright: '2003', issue: 'for marupok only'},
  {dateadd: 'April 15, 2024', booktitle: 'One Piece', author: 'Eiichiro Oda', location: 'FIL', copyright: '1999', issue: 'sobrang haba'}, 
  {dateadd: 'April 16, 2024', booktitle: 'Ang alamat ng Marupok', author: 'Sempre ako na yun', location: 'FIL', copyright: '2003', issue: 'for marupok only'},
  {dateadd: 'April 15, 2024', booktitle: 'One Piece', author: 'Eiichiro Oda', location: 'FIL', copyright: '1999', issue: 'sobrang haba'}, 
  {dateadd: 'April 16, 2024', booktitle: 'Ang alamat ng Marupok', author: 'Sempre ako na yun', location: 'FIL', copyright: '2003', issue: 'for marupok only'},
  {dateadd: 'April 15, 2024', booktitle: 'One Piece', author: 'Eiichiro Oda', location: 'FIL', copyright: '1999', issue: 'sobrang haba'}, 
  {dateadd: 'April 16, 2024', booktitle: 'Ang alamat ng Marupok', author: 'Sempre ako na yun', location: 'FIL', copyright: '2003', issue: 'for marupok only'},
  {dateadd: 'April 15, 2024', booktitle: 'One Piece', author: 'Eiichiro Oda', location: 'FIL', copyright: '1999', issue: 'sobrang haba'}, 
  {dateadd: 'April 16, 2024', booktitle: 'Ang alamat ng Marupok', author: 'Sempre ako na yun', location: 'FIL', copyright: '2003', issue: 'for marupok only'},
];
