import { AfterViewInit, Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MatPaginator, MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { ChangeDetectorRef } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { DataService } from '../../../../../../../../services/data.service';
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
  displayedColumns: string[] = ['department', 'category', 'title', 'date_published', 'created_at'];
  dataSource : any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator) paginatior !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;
  department: any;
  type: any;
  published: any;
  added: any;
  title: any;

  ngOnInit(): void {
    this.getData();
    // this.dataSource = new MatTableDataSource<PeriodicElement>(this.getData());
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
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
    this.ds.get('projects').subscribe({
      next: (res: any) => {    
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      }
    })
  }
  // Filtering 
  applyFilter(event: Event, type: string) {

    const search = (document.getElementById('search') as HTMLInputElement).value;

      const departmentFilterPredicate = (data: GcComponent, search: string): boolean => {
        return data.department.toLowerCase().includes(search.toLowerCase());
      }

      const typeFilterPredicate = (data: GcComponent, search: string): boolean => {
        return data.type.some((x: any) => {
          return x.toLowerCase().trim().includes(search.toLowerCase().trim());
        });
      }

      const titleFilterPredicate = (data: GcComponent, search: string): boolean => {
        return data.title.some((x: any) => {
          return x.toLowerCase().trim().includes(search.toLowerCase().trim());
        });
      }

      const publishedFilterPredicate = (data: GcComponent, search: string): boolean => {
        return data.published.some((x: any) => {
          return x.toLowerCase().trim().includes(search.toLowerCase().trim());
        });
      }

      const addedFilterPredicate = (data: GcComponent, search: string): boolean => {
        return data.added.some((x: any) => {
          return x.toLowerCase().trim().includes(search.toLowerCase().trim());
        });
      }

      const filterPredicate = (data: GcComponent): boolean => {
        return (departmentFilterPredicate(data, search) ||
               typeFilterPredicate(data, search));
               titleFilterPredicate(data, search);
               publishedFilterPredicate(data, search);
               addedFilterPredicate(data, search);

      };
      
      this.dataSource.filterPredicate = filterPredicate;
      this.dataSource.filter = search;
  }
}

export interface PeriodicElement {
  department: string,
  category: string;
  title: string;
  date_published: string;
  created_at: string;
}
