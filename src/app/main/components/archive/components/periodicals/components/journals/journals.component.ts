import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from '../../../../../../../services/data/data.service';
import { MaterialModule } from '../../../../../../../modules/material/material.module';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-journals',
  templateUrl: './journals.component.html',
  styleUrl: './journals.component.scss',
  standalone: true,
  imports: [
    MaterialModule
  ],
})
export class JournalsComponent implements OnInit {
  displayedColumns: string[] = ['archived_at', 'accession', 'title', 'authors', 'actions'];
  protected dataSource!: any;
  datepickerStart = ''; datepickerEnd = ''; searchInput = '';

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator) paginatior !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;

  constructor(
    private router: Router,
    private paginatorIntl: MatPaginatorIntl,
    private changeDetectorRef: ChangeDetectorRef,
    private ds: DataService
  ) { this.paginator = new MatPaginator(this.paginatorIntl, this.changeDetectorRef); }

  protected activities: any;

  ngOnInit(): void {
      this.getData();
  }

  protected getData(): void {
    this.ds.request('GET', 'archives/materials/periodicals/type/0' , null).subscribe((res:any) => {
      this.dataSource = new MatTableDataSource<PeriodicElement>(res);
      this.dataSource.paginator = this.paginator;
    })
  }

  applyFilter(event: Event, type: string) {
    if(type == 'start') this.datepickerStart = (event.target as HTMLInputElement).value;
    else if(type == 'end') this.datepickerEnd = (event.target as HTMLInputElement).value;
    else if(type == 'search') this.searchInput = (event.target as HTMLInputElement).value;

    const search = this.searchInput; const start = this.datepickerStart; const end = this.datepickerEnd; 

    const accessionFilterPredicate = (data: PeriodicElement, search: string): boolean => {
      return data.accession.includes(search);
    }

    const titleFilterPredicate = (data: PeriodicElement, search: string): boolean => {
      return data.title.toLowerCase().includes(search.toLowerCase());
    }

    const authorFilterPredicate = (data: PeriodicElement, search: string): boolean => {
      if(data.authors) {
        return data.authors.some((x: any) => {
          return x.toLowerCase().trim().includes(search.toLowerCase().trim());
        });
      } else return false;      
    }
  
    // FOR DATE RANGE DATE PICKER
    const startFilterPredicate = (data: PeriodicElement, start: string): boolean => {
      if(start == '')
          return true;
      return Date.parse(data.archived_at) >= Date.parse(start + ' 00:00:00');
    }

    const endFilterPredicate = (data: PeriodicElement, end: string): boolean => {
      if(end == '')
          return true;
      return Date.parse(data.archived_at) <= Date.parse(end + ' 23:59:59');
    }

    const filterPredicate = (data: PeriodicElement): boolean => {
      return (titleFilterPredicate(data, search) ||
              authorFilterPredicate(data, search) ||
              accessionFilterPredicate(data, search)) &&
              (startFilterPredicate(data, start) && endFilterPredicate(data, end))
    };
      
    this.dataSource.filterPredicate = filterPredicate;
    this.dataSource.filter = {
        search,
        start, 
        end
    };
  }

  // RESTORE PROCESS/POPUP
  restoreBox(accession: any){
    Swal.fire({
      title: 'Restore Journal',
      text: 'Are you sure you want to restore this journal?',
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
        this.ds.request('POST', 'materials/restore/' + accession, null).subscribe({
          next: (res: any) => {
            Swal.fire({
              title: "Restoring Complete!",
              text: "Journal has been restored.",
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
            this.getData();
          },
          error: (err: any) => {
            Swal.fire({
              title: "Error!",
              text: err.message,
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
        })
      }
    });
  }

  // PERMANENTLY DELETE
  deleteBox(accession: any){
    Swal.fire({
      title: 'Permanent Deletion',
      text: 'Are you sure you want to permanently delete this journal? This action cannot be undone.',
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
        this.ds.request('DELETE', 'permanently-delete/materials/' + accession, null).subscribe({
          next: (res: any) => {
            Swal.fire({
              title: "Journal Permanently Deleted",
              text: "Journal has been permanently deleted and cannot be recovered.",
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
            this.getData();
          }, error: (err: any) => {
            Swal.fire({
              title: "Error!",
              text: err.message,
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
    });
  }
}

// DATA FOR TABLE
export interface PeriodicElement {
  archived_at: string;
  accession: string;
  title: string;
  authors: any;
}