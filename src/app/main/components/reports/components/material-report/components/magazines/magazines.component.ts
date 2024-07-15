import { AfterViewInit, Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MatPaginator, MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { ChangeDetectorRef } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { DataService } from '../../../../../../../services/data/data.service';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';

@Component({
  selector: 'app-magazines',
  templateUrl: './magazines.component.html',
  styleUrls: ['./magazines.component.scss'],
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
export class MagazinesComponent implements OnInit {
  displayedColumns: string[] = [ 'accession','title', 'author', 'copyright', 'received' ];
  dataSource : any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator) paginatior !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;
  title: any;
  authors: any;
  copyright: string | undefined;
  received: string | undefined;


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
    this.ds.request('GET', 'materials/periodicals/type/1', null).subscribe({
      next: (res: any) => {
        for(let i = 0; i < res.length; i++) {
          for(let j = i + 1; j < res.length; j++) {
            if(res[i].id > res[j].id) {
              let temp = res[i];
              res[i] = res[j];
              res[j] = temp;
            }
          }
        }
        
        this.dataSource = new MatTableDataSource<PeriodicElement>(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    })
  }

// FILTER DATA
applyFilter(event: Event, type: string) {

  const search = (document.getElementById('search-magazine') as HTMLInputElement).value;

  const accessionFilterPredicate = (data: PeriodicElement, search: string): boolean => {
    return data.accession == search;
  }

  const titleFilterPredicate = (data: PeriodicElement, search: string): boolean => {
    return data.title.toLowerCase().includes(search.toLowerCase());
  }

  const authorFilterPredicate = (data: PeriodicElement, search: string): boolean => {
    return data.authors.some((x: any) => {
      return x.toLowerCase().trim().includes(search.toLowerCase().trim());
    });
  }

  const copyrightFilterPredicate = (data: PeriodicElement, search: string): boolean => {
    return data.copyright == search;
  }

  const receive_dateFilterPredicate = (data: PeriodicElement, search: string): boolean => {
    return data.receive_date.toLowerCase().includes(search.toLowerCase());
  }

  // FOR DATE RANGE DATE PICKER
  const start = (document.getElementById('datepicker-start-magazine') as HTMLInputElement).value;
  const end = (document.getElementById('datepicker-end-magazine') as HTMLInputElement).value;

    const startFilterPredicate = (data: PeriodicElement, start: string): boolean => {
      if(start == '')
          return true;
      return Date.parse(data.created_at) >= Date.parse(start + ' 00:00:00');
    }

    const endFilterPredicate = (data: PeriodicElement, end: string): boolean => {
      if(end == '')
          return true;
      return Date.parse(data.created_at) <= Date.parse(end + ' 23:59:59');
    }

  const filterPredicate = (data: PeriodicElement): boolean => {
    return (titleFilterPredicate(data, search) ||
            authorFilterPredicate(data, search) ||
            accessionFilterPredicate(data, search) ||
            receive_dateFilterPredicate(data, search) ||
            copyrightFilterPredicate(data, search)) &&
            (startFilterPredicate(data, start) && endFilterPredicate(data, end))
  };
  
  this.dataSource.filterPredicate = filterPredicate;
  this.dataSource.filter = {
    search,
    start, 
    end
  };
}
}

export interface PeriodicElement {
  accession: string;
  title: string;
  authors: any;
  copyright: string;
  receive_date: string;
  created_at: string;
  author: any;
}