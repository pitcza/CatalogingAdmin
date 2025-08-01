import { Component, ViewChild } from '@angular/core';
import { DataService } from '../../../../../../../services/data/data.service';
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
import { TableModule } from '../../../../../../../modules/table.module';
import { ReportsService } from '../../../../../../../services/reports/reports.service';
import Swal from 'sweetalert2';

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

  displayedColumns: string[] = [ 'department', 'category', 'author', 'title', 'date_published'];
  dataSource : any;
  datepickerStart = ''; datepickerEnd = ''; searchInput = '';
  uniqueCategories: string[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;

  constructor (
    private ds: DataService,
    private paginatorIntl: MatPaginatorIntl,
    private changeDetectorRef: ChangeDetectorRef, 
    private reportService: ReportsService
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
    if(type == 'start') this.datepickerStart = (event.target as HTMLInputElement).value;
    else if(type == 'end') this.datepickerEnd = (event.target as HTMLInputElement).value;
    else if(type == 'search') this.searchInput = (event.target as HTMLInputElement).value;

    const search = this.searchInput; const start = this.datepickerStart; const end = this.datepickerEnd;
    
    const departmentFilterPredicate = (data: GcComponent, search: string): boolean => {
      return data.project_program.department_short.toLowerCase() == search.toLowerCase();
    }

    const categoryFilterPredicate = (data: GcComponent, search: string): boolean => {
      return data.category.toLowerCase().includes(search.toLowerCase());
    }

    const authorFilterPredicate = (data: GcComponent, search: string): boolean => {
      if(data.authors) {
        return data.authors.some((x: any) => {
          return x.toLowerCase().trim().includes(search.toLowerCase().trim());
        });
      } else return false;      
    }

    const titleFilterPredicate = (data: GcComponent, search: string): boolean => {
      return data.title.toLowerCase().includes(search.toLowerCase());
    }

    const publishedFilterPredicate = (data: GcComponent, search: string): boolean => {
      return data.date_published.toLowerCase().includes(search.toLowerCase());
    }

    // FOR DATE RANGE DATE PICKER

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
      return (titleFilterPredicate(data, search) ||
              authorFilterPredicate(data, search) ||
              departmentFilterPredicate(data, search) ||
              categoryFilterPredicate(data, search) ||
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
    this.reportService.exportToExcel(filteredData, 'Cataloging Academic Projects Report');
  }
}

export interface GcComponent {
  program: string;
  project_program: any;
  category: string;
  authors: any;
  title: string;
  date_published: string;
  created_at: string;
}
