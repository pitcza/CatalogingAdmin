import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import Swal from 'sweetalert2';

import { EditPeriodicalComponent } from '../edit-periodical/edit-periodical.component';
import { PerioDetailsComponent } from '../perio-details/perio-details.component';
import { DataSource } from '@angular/cdk/collections';
import { DataService } from '../../../../../../../services/data.service';

@Component({
  selector: 'app-newspapers',
  templateUrl: './newspapers.component.html',
  styleUrl: './newspapers.component.scss',
  // standalone: true,
  // imports: [
  //   MatTableModule,
  //   MatPaginatorModule
  // ]
})

export class NewspapersComponent implements AfterViewInit {
  displayedColumns: string[] = ['title', 'author', 'publisher', 'copyright', 'action'];
  dataSource: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator) paginatior !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;

  ngAfterViewInit() {
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


  // DATA FOR FILTERING
  

}

// SAMPLE DATA FOR TABLES

export interface Newspaper {
  created_at: string;
  title: string;
  publisher: string;
  copyright: string;
  action: string;
}
