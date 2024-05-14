import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, ViewChild, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import Swal from 'sweetalert2';

import { EditPeriodicalComponent } from '../edit-periodical/edit-periodical.component';
import { PerioDetailsComponent } from '../perio-details/perio-details.component';
import { DataService } from '../../../../../../../services/data.service';

@Component({
  selector: 'app-magazines',
  templateUrl: './magazines.component.html',
  styleUrl: './magazines.component.scss',
})

export class MagazinesComponent implements OnInit {
  displayedColumns: string[] = ['title', 'author', 'publisher', 'copyright', 'action'];
  dataSource: any;
  publishers: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator) paginatior !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;

  ngOnInit() {
    this.getData();
  }

  constructor(
    private router: Router,
    private paginatorIntl: MatPaginatorIntl, 
    private elementRef: ElementRef, 
    private changeDetectorRef: ChangeDetectorRef,
    private dialog: MatDialog,
    private ds: DataService,
  ) {
  this.paginator = new MatPaginator(this.paginatorIntl, this.changeDetectorRef);
  }

  getData() {
    this.ds.get('periodicals/type/magazine').subscribe({
      next: (res: any) => {
        this.dataSource = new MatTableDataSource<Magazine>(res)
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        const publishers = new Set<string>();
        res.forEach((x: any) => {
            publishers.add(x.publisher);
        });

        // Convert the Set back to an array
        this.publishers = Array.from(publishers);
      }
    })
  }
  
  // POP UPS FUNCTION

  showPopup: boolean = false;

  closePopup() {
    this.showPopup = this.showPopup;
  }

  editPopup(code: any) {
    this.Openpopup(code, 'Edit Periodical', EditPeriodicalComponent);
  }

  detailsPopup(code: any) {
    console.log(code)
    this.Openpopup(code, 'Periodical Details', PerioDetailsComponent);
  }

  Openpopup(code: any, title: any,component:any) {
    var _popup = this.dialog.open(component, {
      width: '40%',
      enterAnimationDuration: '100ms',
      exitAnimationDuration: '100ms',
      data: {
        title: title,
        details: code
      }
    });
    _popup.afterClosed().subscribe(result => {
      if(result === 'Changed Data') {
        this.getData();
      }
    });
  }

  // SWEETALERT ARCHIVE POP UP
  archiveBox(id: number){
    Swal.fire({
      title: "Archive Magazine",
      text: "Are you sure want to archive this magazine?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
      confirmButtonColor: "#AB0E0E",
      cancelButtonColor: "#777777",
    }).then((result) => {
      if (result.isConfirmed) {
        this.ds.delete('periodicals/process/' + id).subscribe({
          next: (res: any) => {
            Swal.fire({
              title: "Archiving complete!",
              text: "Magazine has been successfully archived.",
              icon: "success",
              confirmButtonText: 'Close',
              confirmButtonColor: "#777777",
            });
            this.getData();
          },
          error: (err: any) => {
            console.log(err)
            Swal.fire({
              title: "Archive Error!",
              text: "Please try again later.",
              icon: "error",
              confirmButtonText: 'Close',
              confirmButtonColor: "#777777",
            });
          }
        })
      }
    });
  }

// FILTER DATA
applyFilter(event: Event, type: string) {

  const select = (document.getElementById('filter') as HTMLSelectElement).value;
  const search = (document.getElementById('search') as HTMLInputElement).value;

  console.log(select, search)
    const titleFilterPredicate = (data: Magazine, search: string): boolean => {
      return data.title.toLowerCase().includes(search.toLowerCase());
    }

    const authorFilterPredicate = (data: Magazine, search: string): boolean => {
      return data.authors.some((x: any) => {
        return x.toLowerCase().trim().includes(search.toLowerCase().trim());
      });
    }

    const publisherFilterPredicate = (data: Magazine, select: string): boolean => {
      return data.publisher === select || select === '';
    }

    const filterPredicate = (data: Magazine): boolean => {
      return (titleFilterPredicate(data, search) ||
             authorFilterPredicate(data, search)) &&
             publisherFilterPredicate(data, select);
    };
    
    this.dataSource.filterPredicate = filterPredicate;
    this.dataSource.filter = {
      search, 
      select
    };    
}

}

// SAMPLE DATA FOR TABLES

export interface Magazine {
  created_at: string;
  authors: any;
  type: string;
  title: string;
  publisher: string;
  copyright: string;
}