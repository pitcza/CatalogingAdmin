import { AfterViewInit, Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MatPaginator, MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { ChangeDetectorRef } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { DataService } from '../../../../../../../../services/data/data.service';
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gc',
  templateUrl: './gc.component.html',
  styleUrls: ['./gc.component.scss'],
  standalone: true, 
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatTableModule,
    MatFormFieldModule,
    MatCardModule
  ], 
})
export class GcComponent implements OnInit {
  displayedColumns: string[] = [ 'department', 'category', 'title', 'date_published', 'created_at'];
  dataSource : any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator) paginatior !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;

  ngOnInit(): void {
    // this.dataSource = new MatTableDataSource<GcComponent>(this.ds.getProjects());
    // this.dataSource.sort = this.sort;
    // this.dataSource.paginator = this.paginator;
    this.getData()
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
    this.ds.request('GET', 'projects', null).subscribe({
      next: (res: any) => {    
    
        this.dataSource = new MatTableDataSource<GcComponent>(res);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      }
    })
  }

  // Filtering 
  applyFilter(event: Event, type: string) {

    const search = (document.getElementById('search-gc') as HTMLInputElement).value;

    const titleFilterPredicate = (data: GcComponent, search: string): boolean => {
      return data.title.toLowerCase().includes(search.toLowerCase());
    }

      const departmentFilterPredicate = (data: GcComponent, search: string): boolean => {
        return data.program.department.department.toLowerCase().includes(search.toLowerCase());
      }

      const categoryFilterPredicate = (data: GcComponent, search: string): boolean => {
        return data.category.toLowerCase().trim().toLowerCase().includes(search.toLowerCase());
      }

      const publishedFilterPredicate = (data: GcComponent, search: string): boolean => {
        return data.date_published.toLowerCase().includes(search.toLowerCase());
      }

      const addedFilterPredicate = (data: GcComponent, search: string): boolean => {
        return data.created_at.toLowerCase().includes(search.toLowerCase());
      }

      // FOR DATE RANGE DATE PICKER
    const start = (document.getElementById('datepicker-start-gc') as HTMLInputElement).value;
    const end = (document.getElementById('datepicker-end-gc') as HTMLInputElement).value;

      const startFilterPredicate = (data: GcComponent, start: string): boolean => {
        if(start == '')
            return true;
        return Date.parse(data.created_at) >= Date.parse(start + ' 00:00:00');
      }

      const endFilterPredicate = (data: GcComponent, end: string): boolean => {
        if(end == '')
            return true;
        return Date.parse(data.created_at) <= Date.parse(end + ' 23:59:59');
      }

      const filterPredicate = (data: GcComponent): boolean => {
        return ((departmentFilterPredicate(data, search) ||
               categoryFilterPredicate(data, search)) ||
               titleFilterPredicate(data, search) ||
               publishedFilterPredicate(data, search) ||
               addedFilterPredicate(data, search)) &&
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

export interface GcComponent {
  authors: any;
  program: any;
  category: string;
  title: string;
  date_published: string;
  created_at: string;
}
