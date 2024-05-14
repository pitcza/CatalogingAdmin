import { AfterViewInit, Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MatPaginator, MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { ChangeDetectorRef } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { DataService } from '../../../../../../../services/data.service';

@Component({
  selector: 'app-magazines',
  templateUrl: './magazines.component.html',
  styleUrls: ['./magazines.component.scss'],
  standalone: true,
  imports: [

    MatPaginatorModule,
    MatTableModule,
    MatFormFieldModule,
    MatCardModule

  ],
})
export class MagazinesComponent implements OnInit {
  displayedColumns: string[] = ['title', 'author', 'copyright', 'received' ];
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
  title: string;
  author: string;
  copyright: string;
  received: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {title: 'One Piece', author: 'Eiichiro Oda', copyright: '1999', received: '2024'}, 
  ];
