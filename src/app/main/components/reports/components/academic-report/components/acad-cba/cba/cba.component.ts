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
  selector: 'app-cba',
  templateUrl: './cba.component.html',
  styleUrls: ['./cba.component.scss'],
  standalone: true, 
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatTableModule,
    MatFormFieldModule,
    MatCardModule

  ], 
})
export class CbaComponent implements OnInit {
  navigateToAbout() {
  throw new Error('Method not implemented.');
  }
    displayedColumns: string[] = ['category', 'title', 'date_published', 'created_at'];
    dataSource : any;
  
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatPaginator) paginatior !: MatPaginator;
    @ViewChild(MatSort) sort !: MatSort;
    type: any;
    title: any;
    published: any;
    added: any;
  
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
      this.ds.get('projects/department/CBA').subscribe({
        next: (res: any) => {    
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;

          let cbatotal = 0;
          let cbaresearch = 0;
          let cbafeasibility = 0;
          for(let project of res) {
            cbatotal++;
            if(project.category == 'Research') {
              cbaresearch++;
            } else if(project.category == 'Feasibility Study') {
              cbafeasibility++;
            }
          }

          (document.getElementById('cba-total') as HTMLHeadingElement).textContent = '' + cbatotal;
          (document.getElementById('cba-research') as HTMLHeadingElement).textContent = '' + cbaresearch;
          (document.getElementById('cba-feasibility') as HTMLHeadingElement).textContent = '' + cbafeasibility;
        }
      })
    }
    // Filtering 
  applyFilter(event: Event, type: string) {

    const search = (document.getElementById('search') as HTMLInputElement).value;

      const typeFilterPredicate = (data: CbaComponent, search: string): boolean => {
        return data.type.some((x: any) => {
          return x.toLowerCase().trim().includes(search.toLowerCase().trim());
        });
      }

      const titleFilterPredicate = (data: CbaComponent, search: string): boolean => {
        return data.title.some((x: any) => {
          return x.toLowerCase().trim().includes(search.toLowerCase().trim());
        });
      }

      const publishedFilterPredicate = (data: CbaComponent, search: string): boolean => {
        return data.published.some((x: any) => {
          return x.toLowerCase().trim().includes(search.toLowerCase().trim());
        });
      }

      const addedFilterPredicate = (data: CbaComponent, search: string): boolean => {
        return data.added.some((x: any) => {
          return x.toLowerCase().trim().includes(search.toLowerCase().trim());
        });
      }

      const filterPredicate = (data: CbaComponent): boolean => {
        return (typeFilterPredicate(data, search) ||
                titleFilterPredicate(data, search));
                publishedFilterPredicate(data, search);
                addedFilterPredicate(data, search);

      };
      
      this.dataSource.filterPredicate = filterPredicate;
      this.dataSource.filter = search;
  }
  }
  
  export interface PeriodicElement {
    category: string;
    title: string;
    date_published: string;
    created_at: string;
  }
  