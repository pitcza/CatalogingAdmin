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
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cahs',
  templateUrl: './cahs.component.html',
  styleUrls: ['./cahs.component.scss'],
  standalone: true, 
  imports: [

    CommonModule,
    MatPaginatorModule,
    MatTableModule,
    MatFormFieldModule,
    MatCardModule

  ], 
})
export class CahsComponent implements OnInit {
  navigateToAbout() {
  throw new Error('Method not implemented.');
  }
    displayedColumns: string[] = ['category', 'title', 'date_published', 'created_at'];
    dataSource : any;
  
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatPaginator) paginatior !: MatPaginator;
    @ViewChild(MatSort) sort !: MatSort;
  
    ngOnInit(): void {
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
      this.ds.request('GET', 'projects/department/CAHS', null).subscribe({
        next: (res: any) => {    
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          
          let cahstotal = 0;
          let cahsresearch = 0;
          for(let project of res) {
            cahstotal++;
            if(project.category == 'Research') {
              cahsresearch++;
            }
          }

          (document.getElementById('cahs-total') as HTMLHeadingElement).textContent = '' + cahstotal;
          (document.getElementById('cahs-research') as HTMLHeadingElement).textContent = '' + cahsresearch;
        }
      })
    }
    
    // Filtering 
  applyFilter(event: Event, type: string) {

    const search = (document.getElementById('search-cahs') as HTMLInputElement).value;

    const titleFilterPredicate = (data: CahsComponent, search: string): boolean => {
      return data.title.toLowerCase().includes(search.toLowerCase());
    }

    const categoryFilterPredicate = (data: CahsComponent, search: string): boolean => {
      return data.category.toLowerCase().trim().toLowerCase().includes(search.toLowerCase());
    }

    const publishedFilterPredicate = (data: CahsComponent, search: string): boolean => {
      return data.date_published.toLowerCase().includes(search.toLowerCase());
    }

    const addedFilterPredicate = (data: CahsComponent, search: string): boolean => {
      return data.created_at.toLowerCase().includes(search.toLowerCase());
    }

      // FOR DATE RANGE DATE PICKER
    const start = (document.getElementById('datepicker-start-cahs') as HTMLInputElement).value;
    const end = (document.getElementById('datepicker-end-cahs') as HTMLInputElement).value;

      const startFilterPredicate = (data: CahsComponent, start: string): boolean => {
        if(start == '')
            return true;
        return Date.parse(data.created_at) >= Date.parse(start + ' 00:00:00');
      }

      const endFilterPredicate = (data: CahsComponent, end: string): boolean => {
        if(end == '')
            return true;
        return Date.parse(data.created_at) <= Date.parse(end + ' 23:59:59');
      }

      const filterPredicate = (data: CahsComponent): boolean => {
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

  export interface CahsComponent {
    category: string;
    title: string;
    date_published: string;
    created_at: string;
  }
  