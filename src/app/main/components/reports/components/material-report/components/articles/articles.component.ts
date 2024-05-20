import { AfterViewInit, Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MatPaginator, MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { ChangeDetectorRef } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { DataService } from '../../../../../../../services/data.service';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';


@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatTableModule,
    MatFormFieldModule,
    MatCardModule

  ],
})
export class ArticlesComponent implements OnInit {
  displayedColumns: string[] = ['id', 'title', 'authors', 'publication'];
  dataSource : any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;
  title: any;
  authors: any;
  publisher: any;
  publication: any;

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
    this.ds.get('articles').subscribe({
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
  // Filtering 
  applyFilter(event: Event, type: string) {

    const search = (document.getElementById('search') as HTMLInputElement).value;

      const titleFilterPredicate = (data: ArticlesComponent, search: string): boolean => {
        return data.title.toLowerCase().includes(search.toLowerCase());
      }

      const authorFilterPredicate = (data: ArticlesComponent, search: string): boolean => {
        return data.authors.some((x: any) => {
          return x.toLowerCase().trim().includes(search.toLowerCase().trim());
        });
      }

      const publisherFilterPredicate = (data: ArticlesComponent, search: string): boolean => {
        return data.publisher.some((x: any) => {
          return x.toLowerCase().trim().includes(search.toLowerCase().trim());
        });
      }

      const publicationFilterPredicate = (data: ArticlesComponent, search: string): boolean => {
        return data.publication.some((x: any) => {
          return x.toLowerCase().trim().includes(search.toLowerCase().trim());
        });
      }

      const filterPredicate = (data: ArticlesComponent): boolean => {
        return (titleFilterPredicate(data, search) ||
               authorFilterPredicate(data, search));
               publisherFilterPredicate(data, search);
               publicationFilterPredicate(data, search);

      };
      
      this.dataSource.filterPredicate = filterPredicate;
      this.dataSource.filter = search;
  }
}

export interface PeriodicElement {
  id: number;
  title: string;
  author: string;
  publisher: string;
  publication: string;
}

