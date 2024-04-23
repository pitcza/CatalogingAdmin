import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { EditPeriodicalComponent } from '../edit-periodical/edit-periodical.component';
import { PeriodicalDetailsPopupComponent } from '../periodical-details-popup/periodical-details-popup.component';

import Swal from 'sweetalert2';
import { DataService } from '../../../../../services/data.service';

@Component({
  selector: 'app-periodicals',
  templateUrl: './periodicals.component.html',
  styleUrl: './periodicals.component.scss',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    CommonModule
  ]
})

export class PeriodicalsComponent implements AfterViewInit {
  displayedColumns: string[] = ['dateadd', 'title', 'publisher', 'copyright', 'action'];
  dataSource: any = null;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator) paginatior !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;

  ngAfterViewInit() {
    this.getData('newspaper');
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

  showPopup: boolean = false;

  protected publishers = ['All Publishers'];
  protected getData(type: any) {
    this.publishers = ['All Publishers'];
    this.ds.get('periodicals/type/' + type).subscribe({
      next: (res: any) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;

        // get publishers
        for(let x of res) {
          let in_array = false;
          for(let y of this.publishers) {
            if(x.publisher == y){
              in_array = true;
              break;
            }
          }
          
          if(in_array == false) 
            this.publishers.push(x.publisher)
        }
      },
      error: (err: any) => console.log(err)
    })
  }

  togglePopup() {
    this.showPopup = !this.showPopup;
  }

  closePopup() {
    this.showPopup = this.showPopup;
  }

  redirectToListPage() {
    this.router.navigate(['main/academicprojects/periodicals']); 
  }


  editPopup(code: any) {
    this.Openpopup(code, 'Edit Periodical', EditPeriodicalComponent);
  }

  detailsPopup(code: any) {
    this.Openpopup(code, 'Periodical Details', PeriodicalDetailsPopupComponent);
  }

  Openpopup(code: any, title: any,component:any) {
    var _popup = this.dialog.open(component, {
      width: '40%',
      enterAnimationDuration: '100ms',
      exitAnimationDuration: '100ms',
      data: {
        title: title,
        code: code
      }
    });
    _popup.afterClosed().subscribe(result => {
      this.redirectToListPage();
    });
  }

// SWEETALERT ARCHIVE POP UP
archiveBox(){
  Swal.fire({
    title: "Archive Periodical",
    text: "Are you sure want to archive this periodical?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'Cancel',
    confirmButtonColor: "#AB0E0E",
    cancelButtonColor: "#777777",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "Archiving complete!",
        text: "Periodical has been safely archived.",
        icon: "success"
      });
    }
  });
}

}

export interface PeriodicElement {
  dateadd: string;
  title: string;
  publisher: string;
  copyright: string;
  action: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {dateadd: 'January 01, 2024', title: 'Sample Title One', publisher: 'Czarina Arellano', copyright: '2017', action: 'ewan'},
  {dateadd: 'January 01, 2024', title: 'Sample Title Ewan One Two Three', publisher: 'Pauleen Dalida', copyright: '2017', action: 'ewan'},
  {dateadd: 'January 01, 2024', title: 'Sample Title One', publisher: 'Czarina Arellano', copyright: '2017', action: 'ewan'},
  {dateadd: 'January 01, 2024', title: 'Sample Title Ewan One Two Three', publisher: 'Pauleen Dalida', copyright: '2017', action: 'ewan'},
  {dateadd: 'January 01, 2024', title: 'Sample Title One', publisher: 'Czarina Arellano', copyright: '2017', action: 'ewan'},
  {dateadd: 'January 01, 2024', title: 'Sample Title Ewan One Two Three', publisher: 'Pauleen Dalida', copyright: '2017', action: 'ewan'},
  {dateadd: 'January 01, 2024', title: 'Sample Title One', publisher: 'Czarina Arellano', copyright: '2017', action: 'ewan'},
  {dateadd: 'January 01, 2024', title: 'Sample Title Ewan One Two Three', publisher: 'Pauleen Dalida', copyright: '2017', action: 'ewan'},
  {dateadd: 'January 01, 2024', title: 'Sample Title One', publisher: 'Czarina Arellano', copyright: '2017', action: 'ewan'},
  {dateadd: 'January 01, 2024', title: 'Sample Title Ewan One Two Three', publisher: 'Pauleen Dalida', copyright: '2017', action: 'ewan'},
  {dateadd: 'January 01, 2024', title: 'Sample Title One', publisher: 'Czarina Arellano', copyright: '2017', action: 'ewan'},
  {dateadd: 'January 01, 2024', title: 'Sample Title Ewan One Two Three', publisher: 'Pauleen Dalida', copyright: '2017', action: 'ewan'},
  {dateadd: 'January 01, 2024', title: 'Sample Title One', publisher: 'Czarina Arellano', copyright: '2017', action: 'ewan'},
  {dateadd: 'January 01, 2024', title: 'Sample Title Ewan One Two Three', publisher: 'Pauleen Dalida', copyright: '2017', action: 'ewan'},
  {dateadd: 'January 01, 2024', title: 'Sample Title One', publisher: 'Czarina Arellano', copyright: '2017', action: 'ewan'},
  {dateadd: 'January 01, 2024', title: 'Sample Title Ewan One Two Three', publisher: 'Pauleen Dalida', copyright: '2017', action: 'ewan'},
  {dateadd: 'January 01, 2024', title: 'Sample Title One', publisher: 'Czarina Arellano', copyright: '2017', action: 'ewan'},
  {dateadd: 'January 01, 2024', title: 'Sample Title Ewan One Two Three', publisher: 'Pauleen Dalida', copyright: '2017', action: 'ewan'},
  {dateadd: 'January 01, 2024', title: 'Sample Title One', publisher: 'Czarina Arellano', copyright: '2017', action: 'ewan'},
  {dateadd: 'January 01, 2024', title: 'Sample Title Ewan One Two Three', publisher: 'Pauleen Dalida', copyright: '2017', action: 'ewan'},
  {dateadd: 'January 01, 2024', title: 'Sample Title One', publisher: 'Czarina Arellano', copyright: '2017', action: 'ewan'},
];

