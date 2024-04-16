import { Component, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MatPaginator, MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ChangeDetectorRef } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';

import { EditdetailsComponent } from '../editdetails/editdetails.component';
import { DetailsPopupComponent } from '../details-popup/details-popup.component';
import Swal from 'sweetalert2';

import { AddprojectComponent } from '../addproject/addproject.component';
import { DataService } from '../../../../../services/data.service';
import { CommonModule } from '@angular/common';

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
    MatCardModule,
    CommonModule
  ],
})
export class ListofprojectsComponent implements AfterViewInit {
  redirectToProjectForm() {
    // Programmatically navigate to another route
    this.router.navigate(['main/academicprojects/addproject']);
  }
  

  displayedColumns: string[] = ['dateadd', 'college', 'program', 'project', 'title', 'datepub', 'action'];
  
  // <PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator, {static:true}) paginator: MatPaginator;
  @ViewChild(MatPaginator, {static:true}) paginatior !: MatPaginator;
  @ViewChild(MatSort, {static:true}) sort !: MatSort;

  protected projects: any = null;
  protected dataSource!: any;

  ngAfterViewInit() {

    this.ds.get('projects', '').subscribe((res: any) => {
      this.projects = res;
      this.dataSource = new MatTableDataSource(this.projects);
      this.dataSource.paginator = this.paginator;
    });
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

  detailsProject(details: any) {
    this.Openpopup(details, 'Project Detail',DetailsPopupComponent);
  }

  Openpopup(details: any, title: any,component:any) {
    var _popup = this.dialog.open(component, {
      width: '40%',
      enterAnimationDuration: '100ms',
      exitAnimationDuration: '100ms',
      data: {
        title: title,
        details: details
      }
    });
    _popup.afterClosed().subscribe(result => {
      this.redirectToListPage();
    });
  }

// SWEETALERT ARCHIVE POP UP
archiveBox(){
  Swal.fire({
    title: "Archive Project",
    text: "Are you sure want to archive this project?",
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
        text: "Project has been safely archived.",
        icon: "success"
      });
    }
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

// export interface PeriodicElement {
//   dateadd: string;
//   college: string;
//   program: string;
//   project: string;
//   title: string;
//   datepub: string;
//   action: string;
// }

// const ELEMENT_DATA: PeriodicElement[] = [
//   {dateadd: 'January 01, 2024', college: 'CCS', program: 'BSIT', project: 'Capstone', title: 'hahahaha', datepub: 'January 01, 2024', action: 'ewan'},
//   {dateadd: 'January 01, 2024', college: 'CCS', program: 'BSIT', project: 'Capstone', title: 'hahahaha', datepub: 'January 01, 2024', action: 'ewan'},
//   {dateadd: 'January 01, 2024', college: 'CCS', program: 'BSIT', project: 'Capstone', title: 'hahahaha', datepub: 'January 01, 2024', action: 'ewan'},
//   {dateadd: 'January 01, 2024', college: 'CCS', program: 'BSIT', project: 'Capstone', title: 'hahahaha', datepub: 'January 01, 2024', action: 'ewan'},
//   {dateadd: 'January 01, 2024', college: 'CCS', program: 'BSCS', project: 'Thesis', title: 'hahhahahahahahaahaha', datepub: 'January 01, 2024', action: 'ewan'},
//   {dateadd: 'January 01, 2024', college: 'CCS', program: 'BSCS', project: 'Thesis', title: 'hahahaha', datepub: 'January 01, 2024', action: 'ewan'},
//   {dateadd: 'January 01, 2024', college: 'CCS', program: 'BSCS', project: 'Thesis', title: 'hahahaha', datepub: 'January 01, 2024', action: 'ewan'},
//   {dateadd: 'January 01, 2024', college: 'CCS', program: 'BSCS', project: 'Thesis', title: 'hahahaha', datepub: 'January 01, 2024', action: 'ewan'},
//   {dateadd: 'January 01, 2024', college: 'CCS', program: 'BSIT', project: 'Capstone', title: 'hahahaha', datepub: 'January 01, 2024', action: 'ewan'},
//   {dateadd: 'January 01, 2024', college: 'CCS', program: 'BSIT', project: 'Capstone', title: 'hahahaha', datepub: 'January 01, 2024', action: 'ewan'},
//   {dateadd: 'January 01, 2024', college: 'CCS', program: 'BSCS', project: 'Thesis', title: 'hahahaha', datepub: 'January 01, 2024', action: 'ewan'},
//   {dateadd: 'January 01, 2024', college: 'CCS', program: 'BSCS', project: 'Thesis', title: 'hahahaha', datepub: 'January 01, 2024', action: 'ewan'},
//   {dateadd: 'January 01, 2024', college: 'CCS', program: 'BSIT', project: 'Capstone', title: 'hahahaha', datepub: 'January 01, 2024', action: 'ewan'},
//   {dateadd: 'January 01, 2024', college: 'CCS', program: 'BSIT', project: 'Capstone', title: 'hahahaha', datepub: 'January 01, 2024', action: 'ewan'},
//   {dateadd: 'January 01, 2024', college: 'CCS', program: 'BSCS', project: 'Thesis', title: 'hahahaha', datepub: 'January 01, 2024', action: 'ewan'},
//   {dateadd: 'January 01, 2024', college: 'CCS', program: 'BSCS', project: 'Thesis', title: 'hahahaha', datepub: 'January 01, 2024', action: 'ewan'},
//   {dateadd: 'January 01, 2024', college: 'CCS', program: 'BSIT', project: 'Capstone', title: 'hahahaha', datepub: 'January 01, 2024', action: 'ewan'},
//   {dateadd: 'January 01, 2024', college: 'CCS', program: 'BSIT', project: 'Capstone', title: 'hahahaha', datepub: 'January 01, 2024', action: 'ewan'},
// ];

