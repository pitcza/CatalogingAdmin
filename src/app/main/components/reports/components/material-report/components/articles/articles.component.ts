import {
  AfterViewInit,
  Component,
  ViewChild,
  ElementRef,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';

import {
  MatPaginator,
  MatPaginatorModule,
  MatPaginatorIntl,
} from '@angular/material/paginator';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { ChangeDetectorRef } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { DataService } from '../../../../../../../services/data/data.service';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';
import { ReportsService } from '../../../../../../../services/reports/reports.service';
import Swal from 'sweetalert2';

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
    MatCardModule,
  ],
})
export class ArticlesComponent implements OnInit {
  displayedColumns: string[] = [
    'accession',
    'title',
    'authors',
    'publisher',
    'publication',
  ];
  dataSource: any;
  searchInput: string = '';
  datepickerStart: string = '';
  datepickerEnd: string = '';
  publishers: string[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.getData();
  }

  constructor(
    private router: Router,
    private paginatorIntl: MatPaginatorIntl,
    private elementRef: ElementRef,
    private changeDetectorRef: ChangeDetectorRef,
    private dialog: MatDialog,
    private ds: DataService,
    private reportService: ReportsService,
  ) {
    this.paginator = new MatPaginator(
      this.paginatorIntl,
      this.changeDetectorRef,
    );
  }

  protected getData() {
    this.ds.request('GET', 'materials/articles', null).subscribe({
      next: (res: any) => {
        this.dataSource = new MatTableDataSource<ArticlesComponent>(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.publishers = Array.from(
          new Set(
            res.map((d: ArticlesComponent) => d.publisher || 'No Publisher'),
          ),
        ) as string[];

        this.publishers.sort();

        // Trigger change detection if needed
        this.changeDetectorRef.detectChanges();
      },
    });
  }

  // Filtering
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();

    this.dataSource.filterPredicate = (
      data: ArticlesComponent,
      filter: string,
    ) => {
      return data.publisher.toLowerCase().includes(filter);
    };

    this.dataSource.filter = filterValue;
  }

  public export(): void {
    if (!this.dataSource) {
      Swal.fire({
        title: 'Export Error',
        text: 'Data is empty! Please wait for the app to load data',
        icon: 'error',
        confirmButtonText: 'Close',
        confirmButtonColor: '#777777',
        scrollbarPadding: false,
      });
    }

    // Get the filtered data
    const filteredData = this.dataSource.filteredData;
    this.reportService.exportToExcel(
      filteredData,
      'Cataloging Articles Report',
    );
  }
}

export interface ArticlesComponent {
  accession: string;
  date_published: string;
  title: string;
  authors: any;
  created_at: string;
  acquired_date: string;
  publisher: string;
  copyright: string;
}
