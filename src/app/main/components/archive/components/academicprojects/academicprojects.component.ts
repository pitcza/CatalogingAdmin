import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from '../../../../../services/data/data.service';

import Swal from 'sweetalert2';
import { DetailsComponent } from './details/details.component';

@Component({
  selector: 'app-academicprojects',
  templateUrl: './academicprojects.component.html',
  styleUrl: './academicprojects.component.scss'
})
export class AcademicprojectsComponent implements OnInit {
  displayedColumns: string[] = ['archived_at', 'accession', 'title', 'authors', 'actions'];
  protected dataSource!: any;
  searchInput = ''; datepickerStart = ''; datepickerEnd = '';

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;

  constructor(
    private router: Router,
    private paginatorIntl: MatPaginatorIntl,
    private changeDetectorRef: ChangeDetectorRef,
    private dialog: MatDialog,
    private ds: DataService
  ) { 
    this.dialogRef = dialog;
    this.paginator = new MatPaginator(this.paginatorIntl, this.changeDetectorRef); }

  protected activities: any;

  ngOnInit(): void {
      this.getData();
  }

  protected getData(): void {
    this.ds.request('GET', 'archives/materials/projects', null).subscribe((res:any) => {
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
      title: 'Restore Academic Project',
      text: 'Are you sure you want to restore this academic project?',
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
        this.ds.request('POST', 'projects/restore/' + accession, null).subscribe({
          next: (res: any) => {
            Swal.fire({
              title: "Restoring Complete!",
              text: "Academic project has been restored successfully.",
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
          error: (err: any) => { }          
        })
      }
    });
  }

  // PERMANENTLY DELETE
  deleteBox(accession: any){
    Swal.fire({
      title: 'Permanent Deletion',
      text: 'Are you sure you want to permanently delete this academic project? This action cannot be undone.',
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
        this.ds.request('DELETE', 'permanently-delete/projects/' + accession, null).subscribe({
          next: (res: any) => {
            Swal.fire({
              title: "Academic Project Permanently Deleted",
              text: "Academic project has been permanently deleted and cannot be recovered.",
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

  // VIEW DETAILS POPUP
  isModalOpen: boolean = false;
  dialogRef: MatDialog;
  
  detailsBox(accession:any) {
    if(this.isModalOpen) {
      return
    }
    this.isModalOpen = true
    
    let modal = this.dialogRef.open(DetailsComponent, {data: accession});
    modal.afterClosed().subscribe(
      ( result: { success: any; }) => {
        this.isModalOpen = false
        if(result) this.getData();
      }
    )
  }
}

// DATA FOR TABLE
export interface PeriodicElement {
  archived_at: string;
  title: string;
  accession: any;
  authors: any;
}