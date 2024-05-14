import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  selector: 'app-newspapers',
  templateUrl: './newspapers.component.html',
  styleUrl: './newspapers.component.scss'
})

export class NewspapersComponent implements OnInit {
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
    private ds: DataService
  ) {
  this.paginator = new MatPaginator(this.paginatorIntl, this.changeDetectorRef);
  }

  getData() {
    this.ds.get('periodicals/type/newspaper').subscribe({
      next: (res: any) => {
        this.dataSource = new MatTableDataSource<Newspaper>(res)
        this.dataSource.paginator = this.paginator;

        const publishers = new Set<string>();
        res.forEach((x: any) => {
            publishers.add(x.publisher);
        });

        // Convert the Set back to an array
        this.publishers = Array.from(publishers);
      }
    })
  }

  // POP UPS
  showPopup: boolean = false;

  closePopup() {
    this.showPopup = this.showPopup;
  }

  editPopup(code: any) {
    this.Openpopup(code, 'Edit Periodical', EditPeriodicalComponent);
  }

  detailsPopup(code: any) {
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

  // ARCHIVE POP UP
  archiveBox(id: number){
    Swal.fire({
      title: "Archive Newspaper",
      text: "Are you sure want to archive this newspaper?",
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
              text: "Newspaper has been successfully archived.",
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
      const titleFilterPredicate = (data: Newspaper, search: string): boolean => {
        return data.title.toLowerCase().includes(search.toLowerCase());
      }

      const authorFilterPredicate = (data: Newspaper, search: string): boolean => {
        return data.authors.some((x: any) => {
          return x.toLowerCase().trim().includes(search.toLowerCase().trim());
        });
      }

      const publisherFilterPredicate = (data: Newspaper, select: string): boolean => {
        return data.publisher === select || select === '';
      }

      const filterPredicate = (data: Newspaper): boolean => {
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

export interface Newspaper {
  created_at: string;
  title: string;
  authors: any;
  publisher: string;
  copyright: string;
  action: string;
}
