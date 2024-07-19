import { AfterViewInit, Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MatPaginator, MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { ChangeDetectorRef } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';

import {provideNativeDateAdapter} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';


import { get } from 'http';
import { filter } from 'rxjs';
import { kMaxLength } from 'buffer';
import { ReportsService } from '../../../../../../../services/reports/reports.service';
import { DataService } from '../../../../../../../services/data/data.service';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss'], 
  standalone: false,
  // imports: [
  //   CommonModule,
  //   MatPaginatorModule,
  //   MatTableModule,
  //   MatFormFieldModule,
  //   MatCardModule,
  //   MatSortModule, 
  //   MatDatepickerModule
  // ],
})

export class BooksComponent implements OnInit {
  displayedColumns: string[] = ['id', 'booktitle', 'author', 'location', 'copyright'];
  dataSource : any = null;
  searchInput: string = ''; datepickerStart: string = ''; datepickerEnd: string = '';

  @ViewChild(MatPaginator) paginator: MatPaginator
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
    private ds: DataService,
    private reportService: ReportsService
  ) {
    this.paginator = new MatPaginator(this.paginatorIntl, this.changeDetectorRef);
  }

  protected getData() {
    this.ds.request('GET', 'materials/books', null).subscribe({
      next: (res: any) => {       
        this.dataSource = new MatTableDataSource<PeriodicElement, MatPaginator>(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

      }
    })
  }

  // Filtering 
  applyFilter(event: Event, type: string) {
    if(type == 'start') this.datepickerStart = (event.target as HTMLInputElement).value;
    else if(type == 'end') this.datepickerEnd = (event.target as HTMLInputElement).value;
    else if(type == 'search') this.searchInput = (event.target as HTMLInputElement).value;

    const search = this.searchInput; const start = this.datepickerStart; const end = this.datepickerEnd; 

    const accessionFilterPredicate = (data: PeriodicElement, search: string): boolean => {
      return data.accession == search;
    }

    const locationFilterPredicate = (data: PeriodicElement, search: string): boolean => {
      if(data.location) return data.location.toLowerCase().includes(search.toLowerCase());
      else return false;
    }

    const copyrightFilterPredicate = (data: PeriodicElement, search: string): boolean => {
      return data.copyright == search;
    }

    const titleFilterPredicate = (data: PeriodicElement, search: string): boolean => {
      return data.title.toLowerCase().includes(search.toLowerCase());
    }

    const authorFilterPredicate = (data: PeriodicElement, search: string): boolean => {
      if(data.authors) {
        return data.authors.some((x: any) => {
          return x.toLowerCase().trim().includes(search.toLowerCase().trim());
        });
      } else return false;      
    }

    // FOR DATE RANGE DATE PICKER

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
              locationFilterPredicate(data, search) ||
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

  public export(): void {
    // Get the filtered data
    const filteredData = this.dataSource.filteredData;
    this.reportService.exportToExcel(filteredData, 'Cataloging Books Report');
  }
  
}

export interface PeriodicElement {
  accession: string;
  title: any;
  created_at: string;
  authors: any;
  location: string;
  copyright: string;
}

