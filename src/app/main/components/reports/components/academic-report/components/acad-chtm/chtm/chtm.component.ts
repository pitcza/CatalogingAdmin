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
  type: any;
  title: any;
  published: any;
  added: any;
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

    const search = (document.getElementById('search') as HTMLInputElement).value;

      const typeFilterPredicate = (data: ChtmComponent, search: string): boolean => {
        return data.type.some((x: any) => {
          return x.toLowerCase().trim().includes(search.toLowerCase().trim());
        });
      }

      const titleFilterPredicate = (data: ChtmComponent, search: string): boolean => {
        return data.title.some((x: any) => {
          return x.toLowerCase().trim().includes(search.toLowerCase().trim());
        });
      }

      const publishedFilterPredicate = (data: ChtmComponent, search: string): boolean => {
        return data.published.some((x: any) => {
          return x.toLowerCase().trim().includes(search.toLowerCase().trim());
        });
      }

      const addedFilterPredicate = (data: ChtmComponent, search: string): boolean => {
        return data.added.some((x: any) => {
          return x.toLowerCase().trim().includes(search.toLowerCase().trim());
        });
      }

      const filterPredicate = (data: ChtmComponent): boolean => {
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

