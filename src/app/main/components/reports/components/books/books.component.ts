import { AfterViewInit, Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MatPaginator, MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { ChangeDetectorRef } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { DataService } from '../../../../../services/data.service';

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
export class BooksComponent implements OnInit {
  displayedColumns: string[] = ['dateadd', 'booktitle', 'author', 'location', 'copyright', 'issue'];
  dataSource : any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator) paginatior !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<PeriodicElement>(this.getData());
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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

  protected getData() {
    this.ds.get('books').subscribe({
      next: (res: any) => {
        return res;
      }
    })
    return [];
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

