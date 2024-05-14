import { AfterViewInit, Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MatPaginator, MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { ChangeDetectorRef } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { DataService } from '../../../../../../../services/data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-journals',
  templateUrl: './journals.component.html',
  styleUrls: ['./journals.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatSortModule,
    MatPaginatorModule,
    MatTableModule,
    MatFormFieldModule,
    MatCardModule

  ],
})
export class JournalsComponent implements OnInit {
  displayedColumns: string[] = ['id', 'title', 'authors', 'copyright'];
  dataSource : any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;

  ngOnInit(): void {
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

  protected getData() {
    this.ds.get('periodicals/type/journal').subscribe({
      next: (res: any) => {
        this.dataSource = new MatTableDataSource<PeriodicElement>(res);
        // this.dataSource.paginator = this.paginator;
        // this.dataSource.sort = this.sort;
      }
    })
  }
}

export interface PeriodicElement {
  id: number;
  title: string;
  authors: any;
  copyright: string;
}