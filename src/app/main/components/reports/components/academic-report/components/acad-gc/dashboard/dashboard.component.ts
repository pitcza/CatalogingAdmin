import { Component, ViewChild } from '@angular/core';
import { DataService } from '../../../../../../../../services/data/data.service';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { ChangeDetectorRef } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TableModule } from '../../../../../../../../modules/table.module';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  standalone: true, 
  imports: [
    TableModule
  ], 
})
export class DashboardComponent {

  displayedColumns: string[] = [ 'department', 'category', 'title', 'date_published', 'created_at'];
  dataSource : any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;

  constructor (
    private ds: DataService,
    private paginatorIntl: MatPaginatorIntl,
    private changeDetectorRef: ChangeDetectorRef, 
  ) { 
    this.paginator = new MatPaginator(this.paginatorIntl, this.changeDetectorRef);
  }

  materialCounts = {
    GC: 0,
    CCS: 0,
    CEAS: 0,
    CHTM: 0,
    CBA: 0,
    CAHS: 0,
  }

  ngOnInit(): void {
    this.ds.request('GET', 'reports/project-counts', null).subscribe((res: any) => {
      this.materialCounts = res;
      this.materialCounts.GC = this.materialCounts.CCS + this.materialCounts.CEAS + this.materialCounts.CHTM + this.materialCounts.CBA + this.materialCounts.CAHS
    });
    
    this.getData();
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
