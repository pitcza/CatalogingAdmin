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

import {provideNativeDateAdapter} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';


import { get } from 'http';
import { filter } from 'rxjs';
import { kMaxLength } from 'buffer';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss'], 
  standalone: true,
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatTableModule,
    MatFormFieldModule,
    MatCardModule,
    MatSortModule, 
    MatDatepickerModule
  ],
})

export class BooksComponent implements OnInit {
  displayedColumns: string[] = ['id', 'booktitle', 'author', 'location', 'copyright'];
  dataSource : any = null;
  materials : any = null;

  @ViewChild(MatPaginator) paginator: MatPaginator
  @ViewChild(MatSort) sort !: MatSort;
  title: any;
  authors: any;

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

  protected books: any = null;

  protected getData() {
    this.ds.get('books').subscribe({
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
        
        this.materials = res;
        this.dataSource = new MatTableDataSource<PeriodicElement, MatPaginator>(this.materials);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    })
  }

  // Filtering 
  applyFilter(event: Event, type: string) {

    const search = (document.getElementById('search') as HTMLInputElement).value;

    const accessionFilterPredicate = (data: PeriodicElement, search: string): boolean => {
      return data.id == search;
    }

    const locationFilterPredicate = (data: PeriodicElement, search: string): boolean => {
      return data.location.location.toLowerCase().includes(search.toLowerCase());
    }

    const copyrightFilterPredicate = (data: PeriodicElement, search: string): boolean => {
      return data.copyright == search;
    }

    const titleFilterPredicate = (data: PeriodicElement, search: string): boolean => {
      return data.title.toLowerCase().includes(search.toLowerCase());
    }

    const authorFilterPredicate = (data: PeriodicElement, search: string): boolean => {
      return data.authors.some((x: any) => {
        return x.toLowerCase().trim().includes(search.toLowerCase().trim());
      });
    }

    // FOR DATE RANGE DATE PICKER
    const start = (document.getElementById('datepicker-start') as HTMLInputElement).value;
    const end = (document.getElementById('datepicker-end') as HTMLInputElement).value;

      const startFilterPredicate = (data: PeriodicElement, start: string): boolean => {
        if(start == '')
            return true;
        return Date.parse(data.created_at) >= Date.parse(start);
      }

      const endFilterPredicate = (data: PeriodicElement, end: string): boolean => {
        if(end == '')
            return true;
        return Date.parse(data.created_at) <= Date.parse(end);
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

  
}

export interface PeriodicElement {
  id: string;
  title: any;
  created_at: string;
  authors: any;
  location: any;
  copyright: string;
}

