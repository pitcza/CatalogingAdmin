import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
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
export class ActivitylogComponent implements AfterViewInit {
  displayedColumns: string[] = ['logdate', 'log', 'action', 'logtime'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator) paginatior !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;
  ds: any;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    private router: Router,
    private paginatorIntl: MatPaginatorIntl, 
    private elementRef: ElementRef, 
    private changeDetectorRef: ChangeDetectorRef,
    private dialog: MatDialog
  ) {
  this.paginator = new MatPaginator(this.paginatorIntl, this.changeDetectorRef);
  }

  // DATA FOR FILTERING
  

  protected activities: any;

  ngOnInit(): void {
      this.getData();
  }

  protected getData(): void {
    this.ds.get('cataloging/logs', '').subscribe((res:any) => {
      console.log(res);
    })
  }
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
  
];