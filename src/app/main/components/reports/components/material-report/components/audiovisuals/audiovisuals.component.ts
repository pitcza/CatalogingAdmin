import { AfterViewInit, Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MatPaginator, MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { ChangeDetectorRef } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { DataService } from '../../../../../../../services/data/data.service';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';


@Component({
  selector: 'app-audiovisuals',
  templateUrl: './audiovisuals.component.html',
  styleUrls: ['./audiovisuals.component.scss'], 
  standalone: true,
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatTableModule,
    MatFormFieldModule,
    MatCardModule

  ],
})
export class AudiovisualsComponent implements OnInit {
  displayedColumns: string[] = ['id','title', 'authors', 'copyright'];
  dataSource : any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator) paginatior !: MatPaginator;
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
    this.ds.request('GET', 'materials/audio-visuals', null).subscribe({
      next: (res: any) => {
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
      const titleFilterPredicate = (data: AudiovisualsComponent, search: string): boolean => {
        return data.title.toLowerCase().includes(search.toLowerCase());
      }

      const authorFilterPredicate = (data: AudiovisualsComponent, search: string): boolean => {
        return data.authors.some((x: any) => {
          return x.toLowerCase().trim().includes(search.toLowerCase().trim());
        });
      }

      const copyrightFilterPredicate = (data: AudiovisualsComponent, select: string): boolean => {
        return data.copyright === select || select === '';
      }


      const filterPredicate = (data: AudiovisualsComponent): boolean => {
        return (titleFilterPredicate(data, search) ||
               authorFilterPredicate(data, search)) &&
               copyrightFilterPredicate(data, select);
      };
      
      this.dataSource.filterPredicate = filterPredicate;
      this.dataSource.filter = {
        search, 
        select
      };    
  }

}

export interface PeriodicElement {
  id: number;
  title: string;
  authors: string;
  copyright: string;
}

