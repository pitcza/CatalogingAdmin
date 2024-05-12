import { AfterViewInit, Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MatPaginator, MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { ChangeDetectorRef } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { DataService } from '../../../../../../../../services/data.service';

@Component({
  selector: 'app-gc',
  templateUrl: './gc.component.html',
  styleUrls: ['./gc.component.scss'],
  standalone: true, 
  imports: [

    MatPaginatorModule,
    MatTableModule,
    MatFormFieldModule,
    MatCardModule

  ], 
})
export class GcComponent implements OnInit {
  displayedColumns: string[] = ['department', 'type', 'title', 'publish', 'added'];
  dataSource : any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator) paginatior !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<PeriodicElement>(this.getData());
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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
    this.ds.get('gc').subscribe({
      next: (res: any) => {
        return res;
      }
    })
    return [];
  }
}

export interface PeriodicElement {
  department: string,
  type: string;
  title: string;
  publish: string;
  added: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  {department: '1001', type: 'One Piece', title: 'Eiichiro Oda', publish: 'FIL', added: '1999'}, 
];