import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DataService } from '../../../services/data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-activitylog',
  templateUrl: './activitylog.component.html',
  styleUrl: './activitylog.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule, 
    MatPaginatorModule, 
  ]
})
export class ActivitylogComponent implements OnInit {
  displayedColumns: string[] = ['create_date', 'name', 'log', 'action', 'logtime'];
  protected dataSource: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator) paginatior !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;

  constructor(
    private router: Router,
    private paginatorIntl: MatPaginatorIntl, 
    private changeDetectorRef: ChangeDetectorRef,
    private ds: DataService
  ) {
  this.paginator = new MatPaginator(this.paginatorIntl, this.changeDetectorRef);
  }

  // DATA FOR FILTERING
  

  protected activities: any;

  ngOnInit(): void {
      this.getData();
  }

  protected getData(): void {
    this.ds.get('cataloging/logs').subscribe((res:any) => {
      this.dataSource = new MatTableDataSource<PeriodicElement>(res);
      this.dataSource.paginator = this.paginator;
      console.log(res)
    })
  }
}

// SAMPLE DATA FOR TABLE
export interface PeriodicElement {
  create_date: string;
  log: string;
  action: string;
  logtime: string;
}
