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
  selector: 'app-newspapers',
  templateUrl: './newspapers.component.html',
  styleUrls: ['./newspapers.component.scss'],
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
export class NewspapersComponent implements OnInit {
  displayedColumns: string[] = ['accession','title', 'author', 'copyright', 'received'];
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
    this.ds.get('periodicals/type/newspaper').subscribe({
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
        
        this.dataSource = new MatTableDataSource<NewspapersComponent>(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    })
  }

  // FILTER DATA
  applyFilter(event: Event, type: string) {

    const search = (document.getElementById('search-newspaper') as HTMLInputElement).value;

      const titleFilterPredicate = (data: NewspapersComponent, search: string): boolean => {
        return data.title.toLowerCase().includes(search.toLowerCase());
      }

      const authorFilterPredicate = (data: NewspapersComponent, search: string): boolean => {
        return data.authors.some((x: any) => {
          return x.toLowerCase().trim().includes(search.toLowerCase().trim());
        });
      }

      const copyrightFilterPredicate = (data: NewspapersComponent, search: string): boolean => {
        return data.copyright === search || search === '';
      }

      const receivedFilterPredicate = (data: NewspapersComponent, search: string): boolean => {
        return data.receive_date.toLowerCase().includes(search.toLowerCase());
      }

      // FOR DATE RANGE DATE PICKER
      const start = (document.getElementById('datepicker-start-newspaper') as HTMLInputElement).value;
      const end = (document.getElementById('datepicker-end-newspaper') as HTMLInputElement).value;

      console.log(start, end)
        const startFilterPredicate = (data: NewspapersComponent, start: string): boolean => {
          if(start == '')
              return true;
          return Date.parse(data.created_at) >= Date.parse(start + ' 00:00:00');
        }

        const endFilterPredicate = (data: NewspapersComponent, end: string): boolean => {
          if(end == '')
              return true;
          return Date.parse(data.created_at) <= Date.parse(end + ' 23:59:59');
        }

      const filterPredicate = (data: NewspapersComponent): boolean => {
        return (titleFilterPredicate(data, search) ||
               authorFilterPredicate(data, search) ||
               copyrightFilterPredicate(data, search)||
               receivedFilterPredicate(data, search)) &&
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

export interface NewspapersComponent {
  accession: string;
  title: string;
  authors: any;
  receive_date: string;
  created_at: string;
  copyright: string;
}
