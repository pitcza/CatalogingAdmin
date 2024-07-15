import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from '../../../../../services/data/data.service';
import { MaterialModule } from '../../../../../modules/material/material.module';

@Component({
  selector: 'app-academicprojects',
  templateUrl: './academicprojects.component.html',
  styleUrl: './academicprojects.component.scss'
})
export class AcademicprojectsComponent implements OnInit {
  displayedColumns: string[] = ['create_date', 'name', 'title', 'location'];
  protected dataSource!: any;

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

  protected activities: any;

  ngOnInit(): void {
      this.getData();
  }

  protected getData(): void {
    this.ds.request('GET', 'archives/projects', null).subscribe((res:any) => {
      this.dataSource = new MatTableDataSource<PeriodicElement>(res);
      this.dataSource.paginator = this.paginator;
      console.log(res)
    })
  }

  filterPredicates() {
    const start = (document.getElementById('datepicker-start') as HTMLInputElement).value;
    const end = (document.getElementById('datepicker-end') as HTMLInputElement).value;

      const startFilterPredicate = (data: PeriodicElement, start: string): boolean => {
        if(start == '')
            return true;
        return Date.parse(data.create_date) >= Date.parse(start);
      }

      const endFilterPredicate = (data: PeriodicElement, end: string): boolean => {
        if(end == '')
            return true;
        return Date.parse(data.create_date) <= Date.parse(end);
      }

      const filterPredicate = (data: PeriodicElement): boolean => {
        return startFilterPredicate(data, start) && endFilterPredicate(data, end)
      };

      this.dataSource.filterPredicate = filterPredicate;
      this.dataSource.filter ={
        start,
        end
      };
  }
}

// DATA FOR TABLE
export interface PeriodicElement {
  create_date: string;
  log: string;
  locatioin: string;
  logtime: string;
}

