import { Component, ViewChild } from '@angular/core';
import { DataService } from '../../../../../../../../services/data/data.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { ChangeDetectorRef } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TableModule } from '../../../../../../../../modules/table.module';

@Component({
  selector: 'app-cba-dashboard',
  templateUrl: './cba-dashboard.component.html',
  styleUrl: './cba-dashboard.component.scss',
  standalone: true, 
  imports: [
    TableModule
  ], 
})
export class CbaDashboardComponent {

  displayedColumns: string[] = ['category', 'title', 'date_published', 'created_at'];
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
    gc: 0,
    ccs: 0,
    ceas: 0,
    chtm: 0,
    cba: 0,
    cahs: 0,
  }

  ngOnInit(): void {
      this.counts();
      this.getData();
  }

  protected counts() {
    this.ds.request('GET', 'projects', null).subscribe({
      next: (res: any) => {
        console.log(res)
        res.forEach((x: any) => {
          this.materialCounts.gc++;

          if(x.program.department.department == 'CCS')
            this.materialCounts.ccs++;
          else if(x.program.department.department == 'CEAS')
            this.materialCounts.ceas++;
          else if(x.program.department.department == 'CHTM')
            this.materialCounts.chtm++;
          else if(x.program.department.department == 'CBA')
            this.materialCounts.cba++;
          else if(x.program.department.department == 'CAHS')
            this.materialCounts.cahs++;

          console.log(this.materialCounts)
        });
      }
    });
  }  

  protected getData() {
    this.ds.request('GET', 'projects/department/CBA', null).subscribe({
      next: (res: any) => {    
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;

        let ccstotal = 0;
        let ccsresearch = 0;
        let ccscapstone = 0;
        let ccsthesis = 0;

          for(let project of res) {
            ccstotal++;
            if(project.category == 'Research') {
              ccsresearch++;
            } else if(project.category == 'Capstone') {
              ccscapstone++;
            } else if(project.category == 'Thesis') {
              ccsthesis++;
            }
          }

          (document.getElementById('ccs-total') as HTMLHeadingElement).textContent = '' + ccstotal;
          (document.getElementById('ccs-research') as HTMLHeadingElement).textContent = '' + ccsresearch;
          (document.getElementById('ccs-capstone') as HTMLHeadingElement).textContent = '' + ccscapstone;
          (document.getElementById('ccs-thesis') as HTMLHeadingElement).textContent = '' + ccsthesis;
      }
    })
  }
  // Filtering 
  applyFilter(event: Event, type: string) {
    const search = (document.getElementById('search-ccs') as HTMLInputElement).value;

    const titleFilterPredicate = (data: CbaComponent, search: string): boolean => {
      return data.title.toLowerCase().includes(search.toLowerCase());
    }

    const categoryFilterPredicate = (data: CbaComponent, search: string): boolean => {
      return data.category.toLowerCase().trim().toLowerCase().includes(search.toLowerCase());
    }

    const publishedFilterPredicate = (data: CbaComponent, search: string): boolean => {
      return data.date_published.toLowerCase().includes(search.toLowerCase());
    }

    const addedFilterPredicate = (data: CbaComponent, search: string): boolean => {
      return data.created_at.toLowerCase().includes(search.toLowerCase());
    }

      // FOR DATE RANGE DATE PICKER
    const start = (document.getElementById('datepicker-start-ccs') as HTMLInputElement).value;
    const end = (document.getElementById('datepicker-end-ccs') as HTMLInputElement).value;

      const startFilterPredicate = (data: CbaComponent, start: string): boolean => {
        if(start == '')
            return true;
        return Date.parse(data.created_at) >= Date.parse(start + ' 00:00:00');
      }

      const endFilterPredicate = (data: CbaComponent, end: string): boolean => {
        if(end == '')
            return true;
        return Date.parse(data.created_at) <= Date.parse(end + ' 23:59:59');
      }

      const filterPredicate = (data: CbaComponent): boolean => {
        return (titleFilterPredicate(data, search) ||
                categoryFilterPredicate(data, search) ||
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

export interface CbaComponent {
  category: string;
  title: string;
  date_published: string;
  created_at: string;
}