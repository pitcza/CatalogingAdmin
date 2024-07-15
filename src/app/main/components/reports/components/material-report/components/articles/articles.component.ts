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
  displayedColumns: string[] = ['accession', 'title', 'authors', 'publication'];
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
  applyFilter(event: Event) {

    const search = (document.getElementById('search-article') as HTMLInputElement).value;

    
    const accessionFilterPredicate = (data: ArticlesComponent, search: string): boolean => {
      return data.accession === '' || '' === search;
    }

    const titleFilterPredicate = (data: ArticlesComponent, search: string): boolean => {
      return data.title.toLowerCase().includes(search.toLowerCase());
    }

    const authorFilterPredicate = (data: ArticlesComponent, search: string): boolean => {
      return data.authors.some((x: any) => {
        return x.toLowerCase().trim().includes(search.toLowerCase().trim());
      });
    }

    // FOR DATE RANGE DATE PICKER
    const start = (document.getElementById('datepicker-start-article') as HTMLInputElement).value;
    const end = (document.getElementById('datepicker-end-article') as HTMLInputElement).value;

    console.log(start, end)
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
             accessionFilterPredicate(data, search)) &&
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
    this.reportService.exportToExcel(filteredData, 'articles_export');
  }
}

export interface ArticlesComponent {
  accession: string;
  title: string;
  authors: any;
  publisher: string;
  created_at: string;
  publication: string;
}

