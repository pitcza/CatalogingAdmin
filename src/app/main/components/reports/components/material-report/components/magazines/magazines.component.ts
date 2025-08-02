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
import { MatSort, MatSortModule } from '@angular/material/sort';
import { DataService } from '../../../../../../../services/data/data.service';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';
import { ReportsService } from '../../../../../../../services/reports/reports.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-magazines',
  templateUrl: './magazines.component.html',
  styleUrls: ['./magazines.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatSortModule,
    MatPaginatorModule,
    MatTableModule,
    MatFormFieldModule,
    MatCardModule,
  ],
})
export class MagazinesComponent implements OnInit {
  displayedColumns: string[] = [
    'accession',
    'title',
    'author',
    'copyright',
    'received',
  ];
  dataSource: any;
  copyright: string = '';
  datepickerStart: string = '';
  datepickerEnd: string = '';
  uniqueCopyrights: string[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator) paginatior!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  title: any;
  authors: any;

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
    this.ds.request('GET', 'materials/periodicals/type/1', null).subscribe({
      next: (res: any) => {
        for (let i = 0; i < res.length; i++) {
          for (let j = i + 1; j < res.length; j++) {
            if (res[i].id > res[j].id) {
              let temp = res[i];
              res[i] = res[j];
              res[j] = temp;
            }
          }
        }

        this.dataSource = new MatTableDataSource<PeriodicElement>(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.uniqueCopyrights = Array.from(
          new Set(res.map((d: PeriodicElement) => d.copyright || 'N.D.')),
        ) as string[];

        this.uniqueCopyrights.sort();

        // Trigger change detection if needed
        this.changeDetectorRef.detectChanges();
      },
    });
  }

  // Filtering
  applyFilter(event: Event, type: string) {
    if (type == 'start')
      this.datepickerStart = (event.target as HTMLInputElement).value;
    else if (type == 'end')
      this.datepickerEnd = (event.target as HTMLInputElement).value;
    else if (type == 'copyright')
      this.copyright = (event.target as HTMLInputElement).value;

    // FOR DATE RANGE DATE PICKER

    const copyrightFilterPredicate = (
      data: PeriodicElement,
      search: string,
    ): boolean => {
      return (
        data.copyright == search ||
        (data.copyright == null && search == 'N.D.') ||
        search == ''
      );
    };

    const startFilterPredicate = (
      data: PeriodicElement,
      start: string,
    ): boolean => {
      if (start == '') return true;
      return Date.parse(data.acquired_date) >= Date.parse(start + ' 00:00:00');
    };

    const endFilterPredicate = (
      data: PeriodicElement,
      end: string,
    ): boolean => {
      if (end == '') return true;
      return Date.parse(data.acquired_date) <= Date.parse(end + ' 23:59:59');
    };

    const filterPredicate = (data: PeriodicElement): boolean => {
      return (
        copyrightFilterPredicate(data, this.copyright) &&
        startFilterPredicate(data, this.datepickerStart) &&
        endFilterPredicate(data, this.datepickerEnd)
      );
    };

    this.dataSource.filterPredicate = filterPredicate;
    this.dataSource.filter = {
      copyright: this.copyright,
      start: this.datepickerStart,
      end: this.datepickerEnd,
    };
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
      'Cataloging Magazines Report',
    );
  }
}

export interface PeriodicElement {
  accession: string;
  title: string;
  authors: any;
  copyright: string;
  acquired_date: string;
  created_at: string;
  author: any;
}
