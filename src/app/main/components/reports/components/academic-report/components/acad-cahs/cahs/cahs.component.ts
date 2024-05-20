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

@Component({
  selector: 'app-cahs',
  templateUrl: './cahs.component.html',
  styleUrls: ['./cahs.component.scss'],
  standalone: true, 
  imports: [


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
    type: any;
    title: any;
    published: any;
    added: any;
  
    ngOnInit(): void {
      this.dataSource = new MatTableDataSource<PeriodicElement>(this.getData());
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
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
      this.ds.get('gc').subscribe({
        next: (res: any) => {
          return res;
        }
      })
      return [];
    }
    // Filtering 
  applyFilter(event: Event, type: string) {

    const search = (document.getElementById('search') as HTMLInputElement).value;

      const typeFilterPredicate = (data: CahsComponent, search: string): boolean => {
        return data.type.some((x: any) => {
          return x.toLowerCase().trim().includes(search.toLowerCase().trim());
        });
      }

      const titleFilterPredicate = (data: CahsComponent, search: string): boolean => {
        return data.title.some((x: any) => {
          return x.toLowerCase().trim().includes(search.toLowerCase().trim());
        });
      }

      const publishedFilterPredicate = (data: CahsComponent, search: string): boolean => {
        return data.published.some((x: any) => {
          return x.toLowerCase().trim().includes(search.toLowerCase().trim());
        });
      }

      const addedFilterPredicate = (data: CahsComponent, search: string): boolean => {
        return data.added.some((x: any) => {
          return x.toLowerCase().trim().includes(search.toLowerCase().trim());
        });
      }

      const filterPredicate = (data: CahsComponent): boolean => {
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
  