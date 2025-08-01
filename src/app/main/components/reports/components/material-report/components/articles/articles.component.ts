import { AfterViewInit, Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MatPaginator, MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { ChangeDetectorRef } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { DataService } from '../../../../../../../services/data/data.service';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';
import { ReportsService } from '../../../../../../../services/reports/reports.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatTableModule,
    MatFormFieldModule,
    MatCardModule

  ],
})
export class ArticlesComponent implements OnInit {
  displayedColumns: string[] = ['accession', 'title', 'authors', 'publisher', 'publication'];
  dataSource : any;
  searchInput: string = ''; datepickerStart: string = ''; datepickerEnd: string = '';

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
    private ds: DataService,
    private reportService: ReportsService
  ) {
    this.paginator = new MatPaginator(this.paginatorIntl, this.changeDetectorRef);
  }

  protected getData() {
    this.ds.request('GET', 'materials/articles', null).subscribe({
      next: (res: any) => {        
        this.dataSource = new MatTableDataSource<ArticlesComponent>(res);
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

    const accessionFilterPredicate = (data: ArticlesComponent, search: string): boolean => {
      return data.accession.toLowerCase().includes(search.toLowerCase());
    }
    
    const titleFilterPredicate = (data: ArticlesComponent, search: string): boolean => {
      return data.title.toLowerCase().includes(search.toLowerCase());
    }

    const publishedFilterPredicate = (data: ArticlesComponent, search: string): boolean => {
      return data.date_published.toLowerCase().includes(search.toLowerCase());
    }

    const authorFilterPredicate = (data: ArticlesComponent, search: string): boolean => {
      if(data.authors) {
        return data.authors.some((x: any) => {
          return x.toLowerCase().trim().includes(search.toLowerCase().trim());
        });
      } else return false;      
    }

    // FOR DATE RANGE DATE PICKER

      const startFilterPredicate = (data: ArticlesComponent, start: string): boolean => {
        if(start == '')
            return true;
        return Date.parse(data.created_at) >= Date.parse(start + ' 00:00:00');
      }

      const endFilterPredicate = (data: ArticlesComponent, end: string): boolean => {
        if(end == '')
            return true;
        return Date.parse(data.created_at) <= Date.parse(end + ' 23:59:59');
      }

    const filterPredicate = (data: ArticlesComponent): boolean => {
      return (titleFilterPredicate(data, search) ||
              authorFilterPredicate(data, search) ||
              accessionFilterPredicate(data, search) ||
              publishedFilterPredicate(data, search)) &&
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
    if(!this.dataSource) {
      Swal.fire({
        title: "Export Error",
        text: "Data is empty! Please wait for the app to load data",
        icon: "error",
        confirmButtonText: 'Close',
        confirmButtonColor: "#777777",
        scrollbarPadding: false
      });
    }

    // Get the filtered data
    const filteredData = this.dataSource.filteredData;
    this.reportService.exportToExcel(filteredData, 'Cataloging Articles Report');
  }
}

export interface ArticlesComponent {
  accession: string;
  date_published: string;
  title: string;
  authors: any;
  created_at: string;
  acquired_date: string;
}

