import { Component, ViewChild } from '@angular/core';
import { DataService } from '../../../../../../../services/data/data.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { ChangeDetectorRef } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TableModule } from '../../../../../../../modules/table.module';
import { ReportsService } from '../../../../../../../services/reports/reports.service';

@Component({
  selector: 'app-ccs',
  templateUrl: './ccs.component.html',
  styleUrl: './ccs.component.scss',
  standalone: true, 
  imports: [
    TableModule
  ], 
})
export class CcsComponent {

  displayedColumns: string[] = ['category', 'author', 'title', 'date_published'];
  dataSource : any;
  datepickerStart = ''; datepickerEnd = ''; searchInput = '';

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator) paginatior !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;

  constructor(
    private paginatorIntl: MatPaginatorIntl,
    private changeDetectorRef: ChangeDetectorRef, 
    private ds: DataService,
    private reportService: ReportsService
  ) {
    this.paginator = new MatPaginator(this.paginatorIntl, this.changeDetectorRef);
  }

  materialCounts = {
    total: 0,
    research: 0,
    capstone: 0,
    thesis: 0
  }

  ngOnInit(): void {
      this.getData();
  }

  protected getData() {
    this.ds.request('GET', 'projects/department/CCS', null).subscribe({
      next: (res: any) => {    
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;

        for(let project of res) {
          this.materialCounts.total++;
          if(project.category == 'Research') {
            this.materialCounts.research++;
          } else if(project.category == 'Capstone') {
            this.materialCounts.capstone++;
          } else if(project.category == 'Thesis') {
            this.materialCounts.thesis++;
          }
        }
      }
    })
  }
  
  // Filtering 
  applyFilter(event: Event, type: string) {
    if(type == 'start') this.datepickerStart = (event.target as HTMLInputElement).value;
    else if(type == 'end') this.datepickerEnd = (event.target as HTMLInputElement).value;
    else if(type == 'search') this.searchInput = (event.target as HTMLInputElement).value;

    const search = this.searchInput; const start = this.datepickerStart; const end = this.datepickerEnd;

    const categoryFilterPredicate = (data: CcsComponent, search: string): boolean => {
      return data.category.toLowerCase().includes(search.toLowerCase());
    }

    const authorFilterPredicate = (data: CcsComponent, search: string): boolean => {
      if(data.authors) {
        return data.authors.some((x: any) => {
          return x.toLowerCase().trim().includes(search.toLowerCase().trim());
        });
      } else return false;      
    }

    const titleFilterPredicate = (data: CcsComponent, search: string): boolean => {
      return data.title.toLowerCase().includes(search.toLowerCase());
    }

    const publishedFilterPredicate = (data: CcsComponent, search: string): boolean => {
      return data.date_published.toLowerCase().includes(search.toLowerCase());
    }

    // FOR DATE RANGE DATE PICKER

      const startFilterPredicate = (data: CcsComponent, start: string): boolean => {
        if(start == '')
            return true;
        return Date.parse(data.created_at) >= Date.parse(start + ' 00:00:00');
      }

      const endFilterPredicate = (data: CcsComponent, end: string): boolean => {
        if(end == '')
            return true;
        return Date.parse(data.created_at) <= Date.parse(end + ' 23:59:59');
      }

    const filterPredicate = (data: CcsComponent): boolean => {
      return (titleFilterPredicate(data, search) ||
              authorFilterPredicate(data, search) ||
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
    // Get the filtered data
    const filteredData = this.dataSource.filteredData;
    this.reportService.exportToExcel(filteredData, 'Cataloging CCS Academic Projects Report');
  }
}

export interface CcsComponent {
  category: string;
  authors: any;
  title: string;
  date_published: string;
  created_at: string;
}