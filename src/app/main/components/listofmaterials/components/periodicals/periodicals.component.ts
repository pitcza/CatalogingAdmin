import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { DeletePopupComponent } from '../delete-popup/delete-popup.component';
import { EditPeriodicalComponent } from '../edit-periodical/edit-periodical.component';
import { PeriodicalDetailsPopupComponent } from '../periodical-details-popup/periodical-details-popup.component';

@Component({
  selector: 'app-periodicals',
  templateUrl: './periodicals.component.html',
  styleUrl: './periodicals.component.scss',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule
  ]
})

export class PeriodicalsComponent implements AfterViewInit {
  displayedColumns: string[] = ['dateadd', 'title', 'publisher', 'copyright', 'action'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator) paginatior !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    private router: Router,
    private paginatorIntl: MatPaginatorIntl, 
    private elementRef: ElementRef, 
    private changeDetectorRef: ChangeDetectorRef,
    private dialog: MatDialog
  ) {
  this.paginator = new MatPaginator(this.paginatorIntl, this.changeDetectorRef);
  }

  showPopup: boolean = false;

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
    this.Openpopup(code, 'Edit Project',EditPeriodicalComponent);
  }

  deletePopup(code: any) {
    this.Openpopup(code, 'Delete Project',DeletePopupComponent);
  }

  detailsPopup(code: any) {
    this.Openpopup(code, 'Project Detail',PeriodicalDetailsPopupComponent);
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


  // DATA FOR FILTERING
  data = [
    { college: 'CCS', program: 'BSIT', project: 'Capstone', title: 'Sample Title', datepub: 'January 11, 2024' },
    { college: 'CCS', program: 'BSIT', project: 'Capstone', title: 'Sample Title', datepub: 'January 11, 2024' },
    { college: 'CCS', program: 'BSCS', project: 'Thesis', title: 'Sample Title', datepub: 'January 11, 2024' },
    { college: 'CBA', program: 'BSCA', project: 'Feasibility', title: 'Sample Title', datepub: 'January 11, 2024' },
    { college: 'CBA', program: 'BSCA', project: 'Feasibility', title: 'Sample Title', datepub: 'January 11, 2024' },
    { college: 'CBA', program: 'BSBA', project: 'Feasibility', title: 'Sample Title', datepub: 'January 11, 2024' },
    { college: 'CBA', program: 'BSA', project: 'Feasibility', title: 'Sample Title', datepub: 'January 11, 2024' },
    { college: 'CHTM', program: 'BSHM', project: 'Thesis', title: 'Sample Title', datepub: 'January 11, 2024' },

  ];

  filterValue: string = '';

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

