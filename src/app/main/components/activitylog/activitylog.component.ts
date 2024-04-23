import { AfterViewInit, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-activitylog',
  templateUrl: './activitylog.component.html',
  styleUrl: './activitylog.component.scss',
  standalone: true,
  imports: [
    MatTableModule, 
    MatPaginatorModule, 
  ]
})
export class ActivitylogComponent {
  displayedColumns: string[] = ['logdate', 'log', 'action', 'logtime'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator) paginatior !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    private router: Router,
    private paginatorIntl: MatPaginatorIntl, 
    private changeDetectorRef: ChangeDetectorRef,
  ) {
  this.paginator = new MatPaginator(this.paginatorIntl, this.changeDetectorRef);
  }

  // DATA FOR FILTERING
  

}

// SAMPLE DATA FOR TABLE
export interface PeriodicElement {
  logdate: string;
  log: string;
  action: string;
  logtime: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {logdate: 'January 01, 2024', log: 'Something was added to Books', action: 'Material Added', logtime: '4:00 PM'},
  {logdate: 'January 01, 2024', log: 'Something was added to Books', action: 'Material Added', logtime: '4:00 PM'},
  {logdate: 'January 01, 2024', log: 'Something was added to Books', action: 'Material Added', logtime: '4:00 PM'},
  {logdate: 'January 01, 2024', log: 'Something was added to Books', action: 'Material Added', logtime: '4:00 PM'},
  {logdate: 'January 01, 2024', log: 'Something was added to Books', action: 'Material Added', logtime: '4:00 PM'},
  {logdate: 'January 01, 2024', log: 'Something was added to Books', action: 'Material Added', logtime: '4:00 PM'},
  {logdate: 'January 01, 2024', log: 'Something was added to Books', action: 'Material Added', logtime: '4:00 PM'},
  {logdate: 'January 01, 2024', log: 'Something was added to Books', action: 'Material Added', logtime: '4:00 PM'},
  {logdate: 'January 01, 2024', log: 'Something was added to Books', action: 'Material Added', logtime: '4:00 PM'},
  {logdate: 'January 01, 2024', log: 'Something was added to Books', action: 'Material Added', logtime: '4:00 PM'},
  {logdate: 'January 01, 2024', log: 'Something was added to Books', action: 'Material Added', logtime: '4:00 PM'},
  {logdate: 'January 01, 2024', log: 'Something was added to Books', action: 'Material Added', logtime: '4:00 PM'},
  {logdate: 'January 01, 2024', log: 'Something was added to Books', action: 'Material Added', logtime: '4:00 PM'},
  {logdate: 'January 01, 2024', log: 'Something was added to Books', action: 'Material Added', logtime: '4:00 PM'},
  {logdate: 'January 01, 2024', log: 'Something was added to Books', action: 'Material Added', logtime: '4:00 PM'},
  {logdate: 'January 01, 2024', log: 'Something was added to Books', action: 'Material Added', logtime: '4:00 PM'},
  {logdate: 'January 01, 2024', log: 'Something was added to Books', action: 'Material Added', logtime: '4:00 PM'},
  {logdate: 'January 01, 2024', log: 'Something was added to Books', action: 'Material Added', logtime: '4:00 PM'},
];