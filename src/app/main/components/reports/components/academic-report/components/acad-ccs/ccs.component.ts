import { Component, ViewChild } from '@angular/core';
import { DataService } from '../../../../../../../services/data/data.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { ChangeDetectorRef } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TableModule } from '../../../../../../../modules/table.module';

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

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator) paginatior !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;

  constructor(
    private paginatorIntl: MatPaginatorIntl,
    private changeDetectorRef: ChangeDetectorRef, 
    private ds: DataService
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
    const search = (document.getElementById('search-ccs') as HTMLInputElement).value;

    const titleFilterPredicate = (data: CcsComponent, search: string): boolean => {
      return data.title.toLowerCase().includes(search.toLowerCase());
    }

    const categoryFilterPredicate = (data: CcsComponent, search: string): boolean => {
      return data.category.toLowerCase().trim().toLowerCase().includes(search.toLowerCase());
    }

    const authorFilterPredicate = (data: CcsComponent, search: string): boolean => {
      if(data.authors) {
        return data.authors.some((x: any) => {
          return x.toLowerCase().trim().includes(search.toLowerCase().trim());
        });
      } else return false;      
    }

    const publishedFilterPredicate = (data: CcsComponent, search: string): boolean => {
      return data.date_published.toLowerCase().includes(search.toLowerCase());
    }

      // FOR DATE RANGE DATE PICKER
    const start = (document.getElementById('datepicker-start-ccs') as HTMLInputElement).value;
    const end = (document.getElementById('datepicker-end-ccs') as HTMLInputElement).value;

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
                categoryFilterPredicate(data, search) ||
                authorFilterPredicate(data, search) ||
                publishedFilterPredicate(data, search)) ||
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

export interface CcsComponent {
  category: string;
  authors: any;
  title: string;
  date_published: string;
  created_at: string;
}