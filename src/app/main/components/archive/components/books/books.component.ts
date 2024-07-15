import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from '../../../../../services/data/data.service';
import { MaterialModule } from '../../../../../modules/material/material.module';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrl: './books.component.scss',
  standalone: true,
  imports: [
    MaterialModule
  ],
})
export class BooksComponent implements OnInit {
  displayedColumns: string[] = ['archived_at', 'accession', 'title', 'authors', 'actions'];
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

  // Initialize mock data inside constructor
  const mockData: PeriodicElement[] = [
    { create_date: '2024-07-01', accession: '101', title: 'Sample Title 1', authors: 'Sample 1' },
    { create_date: '2024-07-02', accession: '102', title: 'Sample Title 2', authors: 'Sample 2' },
    { create_date: '2024-07-03', accession: '103', title: 'Sample Title 3', authors: 'Sample 3' }
  ];

  this.dataSource = new MatTableDataSource<PeriodicElement>(mockData);
  }

  protected activities: any;

  ngOnInit(): void {
      this.getData();
  }

  protected getData(): void {
    this.ds.request('GET', 'archives/materials/books', null).subscribe((res:any) => {
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

  // RESTORE PROCESS/POPUP
  restoreBox(accession: any){
    Swal.fire({
      title: 'Restore Book',
      text: 'Are you sure you want to restore this book?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
      confirmButtonColor: "#4F6F52",
      cancelButtonColor: "#777777",
      scrollbarPadding: false,
      willOpen: () => {
        document.body.style.overflowY = 'scroll';
      },
      willClose: () => {
        document.body.style.overflowY = 'scroll';
      }
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Restoring Complete!",
          text: "Book has been restored.",
          icon: "success",
          confirmButtonText: 'Close',
          confirmButtonColor: "#777777",
          scrollbarPadding: false,
          willOpen: () => {
            document.body.style.overflowY = 'scroll';
          },
          willClose: () => {
            document.body.style.overflowY = 'scroll';
          },
          timer: 5000
        });
      }
    });
  }

  // PERMANENTLY DELETE
  deleteBox(accession: any){
    Swal.fire({
      title: 'Permanent Deletion',
      text: 'Are you sure you want to permanently delete this book? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
      confirmButtonColor: "#AB0E0E",
      cancelButtonColor: "#777777",
      scrollbarPadding: false,
      willOpen: () => {
        document.body.style.overflowY = 'scroll';
      },
      willClose: () => {
        document.body.style.overflowY = 'scroll';
      }
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Book Permanently Deleted",
          text: "Book has been permanently deleted and cannot be recovered.",
          icon: "success",
          confirmButtonText: 'Close',
          confirmButtonColor: "#777777",
          scrollbarPadding: false,
          willOpen: () => {
            document.body.style.overflowY = 'scroll';
          },
          willClose: () => {
            document.body.style.overflowY = 'scroll';
          },
        });
      }
    });
  }
}

// DATA FOR TABLE
export interface PeriodicElement {
  create_date: any;
  accession: any;
  title: string;
  authors: string;
}