import { AfterViewInit, Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MatPaginator, MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { ChangeDetectorRef } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { DataService } from '../../../..../../../../../../../services/data.service';
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chtm',
  templateUrl: './chtm.component.html',
  styleUrls: ['./chtm.component.scss'],
  standalone: true, 
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatTableModule,
    MatFormFieldModule,
    MatCardModule

  ],
})
export class ChtmComponent implements OnInit {
  navigateToAbout() {
  throw new Error('Method not implemented.');
  }
    displayedColumns: string[] = ['category', 'title', 'date_published', 'created_at'];
    dataSource : any;
  
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatPaginator) paginatior !: MatPaginator;
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
      private ds: DataService
    ) {
      this.paginator = new MatPaginator(this.paginatorIntl, this.changeDetectorRef);
    }
  
    protected getData() {
      this.ds.get('projects/department/CHTM').subscribe({
        next: (res: any) => {    
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;

          let chtmtotal = 0;
          let chtmthesis = 0;
          let chtmfeasibility = 0;
          for(let project of res) {
            chtmtotal++;
            if(project.category == 'Thesis') {
              chtmthesis++;
            } else if(project.category == 'Feasibility Study') {
              chtmfeasibility++;
            }
          }

          (document.getElementById('chtm-total') as HTMLHeadingElement).textContent = '' + chtmtotal;
          (document.getElementById('chtm-thesis') as HTMLHeadingElement).textContent = '' + chtmthesis;
          (document.getElementById('chtm-feasibility') as HTMLHeadingElement).textContent = '' + chtmfeasibility;
        }
      })
    }
    // Filtering 
  applyFilter(event: Event, type: string) {
    const search = (document.getElementById('search-chtm') as HTMLInputElement).value;

    const titleFilterPredicate = (data: ChtmComponent, search: string): boolean => {
      return data.title.toLowerCase().includes(search.toLowerCase());
    }

    const categoryFilterPredicate = (data: ChtmComponent, search: string): boolean => {
      return data.category.toLowerCase().trim().toLowerCase().includes(search.toLowerCase());
    }

    const publishedFilterPredicate = (data: ChtmComponent, search: string): boolean => {
      return data.date_published.toLowerCase().includes(search.toLowerCase());
    }

    const addedFilterPredicate = (data: ChtmComponent, search: string): boolean => {
      return data.created_at.toLowerCase().includes(search.toLowerCase());
    }

      // FOR DATE RANGE DATE PICKER
    const start = (document.getElementById('datepicker-start-chtm') as HTMLInputElement).value;
    const end = (document.getElementById('datepicker-end-chtm') as HTMLInputElement).value;

      const startFilterPredicate = (data: ChtmComponent, start: string): boolean => {
        if(start == '')
            return true;
        return Date.parse(data.created_at) >= Date.parse(start + ' 00:00:00');
      }

      const endFilterPredicate = (data: ChtmComponent, end: string): boolean => {
        if(end == '')
            return true;
        return Date.parse(data.created_at) <= Date.parse(end + ' 23:59:59');
      }

      const filterPredicate = (data: ChtmComponent): boolean => {
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

export interface ChtmComponent {
  category: string;
  title: string;
  date_published: string;
  created_at: string;
}

