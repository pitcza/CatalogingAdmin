import { AfterViewInit, Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MatPaginator, MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { ChangeDetectorRef } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { DataService } from '../../../../../../../services/data.service';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';

@Component({
  selector: 'app-journals',
  templateUrl: './journals.component.html',
  styleUrls: ['./journals.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatSortModule,
    MatPaginatorModule,
    MatTableModule,
    MatFormFieldModule,
    MatCardModule

  ],
})
export class JournalsComponent implements OnInit {
  displayedColumns: string[] = ['accession', 'title', 'authors', 'copyright', 'received' ];
  dataSource : any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;
  title: any;
  authors: any;
  copyright: string | undefined;
  received: string | undefined;

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
    this.ds.get('periodicals/type/journal').subscribe({
      next: (res: any) => {
        for(let i = 0; i < res.length; i++) {
          for(let j = i + 1; j < res.length; j++) {
            if(res[i].id > res[j].id) {
              let temp = res[i];
              res[i] = res[j];
              res[j] = temp;
            }
          }
        }
        
        this.dataSource = new MatTableDataSource<PeriodicElement>(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    })
  }
  // FILTER DATA
  applyFilter(event: Event, type: string) {

    const select = (document.getElementById('filter') as HTMLSelectElement).value;
    const search = (document.getElementById('search') as HTMLInputElement).value;

    console.log(select, search)
      const titleFilterPredicate = (data: JournalsComponent, search: string): boolean => {
        return data.title.toLowerCase().includes(search.toLowerCase());
      }

      const authorFilterPredicate = (data: JournalsComponent, search: string): boolean => {
        return data.authors.some((x: any) => {
          return x.toLowerCase().trim().includes(search.toLowerCase().trim());
        });
      }

      const copyrightFilterPredicate = (data: JournalsComponent, select: string): boolean => {
        return data.copyright === select || select === '';
      }

      const receivedFilterPredicate = (data: JournalsComponent, select: string): boolean => {
        return data.received === select || select === '';
      }

      const filterPredicate = (data: JournalsComponent): boolean => {
        return (titleFilterPredicate(data, search) ||
               authorFilterPredicate(data, search)) &&
               copyrightFilterPredicate(data, select);
               receivedFilterPredicate(data, select)
      };
      
      this.dataSource.filterPredicate = filterPredicate;
      this.dataSource.filter = {
        search, 
        select
      };    
  }
}

export interface PeriodicElement {
  accession: string;
  title: string;
  authors: any;
  copyright: string;
  received: string;
}