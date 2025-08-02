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
  selector: 'app-audiovisuals',
  templateUrl: './audiovisuals.component.html',
  styleUrls: ['./audiovisuals.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatTableModule,
    MatFormFieldModule,
    MatCardModule,
  ],
})
export class AudiovisualsComponent implements OnInit {
  displayedColumns: string[] = ['id', 'title', 'authors', 'copyright'];
  dataSource: any;
  searchInput: string = '';
  datepickerStart: string = '';
  datepickerEnd: string = '';
  uniqueCopyrights: string[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator) paginatior!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  title: any;
  authors: any;
  copyright: string = '';

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
    this.ds.request('GET', 'materials/audio-visuals', null).subscribe({
      next: (res: any) => {
        this.dataSource = new MatTableDataSource<PeriodicElement>(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.uniqueCopyrights = Array.from(
          new Set(res.map((d: PeriodicElement) => d.copyright || 'N.D.')),
        ) as string[];

        this.uniqueCopyrights.sort();

        console.log(this.uniqueCopyrights);

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
      data: PeriodicElement,
      filter: string,
    ) => {
      return data.copyright == filter || filter == '';
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
      'Cataloging Audio-Visuals Report',
    );
  }
}

export interface PeriodicElement {
  accession: string;
  title: string;
  authors: any;
  copyright: string;
  created_at: string;
}
