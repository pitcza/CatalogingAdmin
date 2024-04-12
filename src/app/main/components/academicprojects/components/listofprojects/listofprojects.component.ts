import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

import { MatPaginator, MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ChangeDetectorRef } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';

import { EditdetailsComponent } from '../editdetails/editdetails.component';
import { DeletePopupComponent } from '../delete-popup/delete-popup.component';
import { DetailsPopupComponent } from '../details-popup/details-popup.component';

@Component({
  selector: 'app-listofprojects',
  templateUrl: './listofprojects.component.html',
  styleUrl: './listofprojects.component.scss',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatCardModule,
    MatTableModule, 
    MatPaginatorModule, 
    MatFormFieldModule, 
    MatCardModule
  ],
})
export class ListofprojectsComponent implements AfterViewInit {
  displayedColumns: string[] = ['dateadd', 'college', 'program', 'project', 'title', 'datepub', 'action'];
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
    this.router.navigate(['main/academicprojects/listofprojects']); 
  }

  // POP UPS
  editProject(code: any) {
    this.Openpopup(code, 'Edit Project',EditdetailsComponent);
  }

  deleteProject(code: any) {
    this.Openpopup(code, 'Delete Project',DeletePopupComponent);
  }

  detailsProject(code: any) {
    this.Openpopup(code, 'Project Detail',DetailsPopupComponent);
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
  college: string;
  program: string;
  project: string;
  title: string;
  datepub: string;
  action: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {dateadd: 'January 01, 2024', college: 'CCS', program: 'BSIT', project: 'Capstone', title: 'hahahaha', datepub: 'January 01, 2024', action: 'ewan'},
  {dateadd: 'January 01, 2024', college: 'CCS', program: 'BSIT', project: 'Capstone', title: 'hahahaha', datepub: 'January 01, 2024', action: 'ewan'},
  {dateadd: 'January 01, 2024', college: 'CCS', program: 'BSIT', project: 'Capstone', title: 'hahahaha', datepub: 'January 01, 2024', action: 'ewan'},
  {dateadd: 'January 01, 2024', college: 'CCS', program: 'BSIT', project: 'Capstone', title: 'hahahaha', datepub: 'January 01, 2024', action: 'ewan'},
  {dateadd: 'January 01, 2024', college: 'CCS', program: 'BSCS', project: 'Thesis', title: 'hahhahahahahahaahaha', datepub: 'January 01, 2024', action: 'ewan'},
  {dateadd: 'January 01, 2024', college: 'CCS', program: 'BSCS', project: 'Thesis', title: 'hahahaha', datepub: 'January 01, 2024', action: 'ewan'},
  {dateadd: 'January 01, 2024', college: 'CCS', program: 'BSCS', project: 'Thesis', title: 'hahahaha', datepub: 'January 01, 2024', action: 'ewan'},
  {dateadd: 'January 01, 2024', college: 'CCS', program: 'BSCS', project: 'Thesis', title: 'hahahaha', datepub: 'January 01, 2024', action: 'ewan'},
  {dateadd: 'January 01, 2024', college: 'CCS', program: 'BSIT', project: 'Capstone', title: 'hahahaha', datepub: 'January 01, 2024', action: 'ewan'},
  {dateadd: 'January 01, 2024', college: 'CCS', program: 'BSIT', project: 'Capstone', title: 'hahahaha', datepub: 'January 01, 2024', action: 'ewan'},
  {dateadd: 'January 01, 2024', college: 'CCS', program: 'BSCS', project: 'Thesis', title: 'hahahaha', datepub: 'January 01, 2024', action: 'ewan'},
  {dateadd: 'January 01, 2024', college: 'CCS', program: 'BSCS', project: 'Thesis', title: 'hahahaha', datepub: 'January 01, 2024', action: 'ewan'},
  {dateadd: 'January 01, 2024', college: 'CCS', program: 'BSIT', project: 'Capstone', title: 'hahahaha', datepub: 'January 01, 2024', action: 'ewan'},
  {dateadd: 'January 01, 2024', college: 'CCS', program: 'BSIT', project: 'Capstone', title: 'hahahaha', datepub: 'January 01, 2024', action: 'ewan'},
  {dateadd: 'January 01, 2024', college: 'CCS', program: 'BSCS', project: 'Thesis', title: 'hahahaha', datepub: 'January 01, 2024', action: 'ewan'},
  {dateadd: 'January 01, 2024', college: 'CCS', program: 'BSCS', project: 'Thesis', title: 'hahahaha', datepub: 'January 01, 2024', action: 'ewan'},
  {dateadd: 'January 01, 2024', college: 'CCS', program: 'BSIT', project: 'Capstone', title: 'hahahaha', datepub: 'January 01, 2024', action: 'ewan'},
  {dateadd: 'January 01, 2024', college: 'CCS', program: 'BSIT', project: 'Capstone', title: 'hahahaha', datepub: 'January 01, 2024', action: 'ewan'},
];

