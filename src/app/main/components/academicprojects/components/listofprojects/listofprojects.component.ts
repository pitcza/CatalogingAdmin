import { Component, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MatPaginator, MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ChangeDetectorRef } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, MatSortModule } from '@angular/material/sort';

import { EditdetailsComponent } from '../details-popup/editdetails/editdetails.component';
import { DetailsPopupComponent } from '../details-popup/details-popup.component';
import Swal from 'sweetalert2';

import { AddprojectComponent } from '../addproject/addproject.component';
import { DataService } from '../../../../../services/data.service';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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
    MatSortModule,
    CommonModule,
    MatProgressSpinnerModule
  ],
})
export class ListofprojectsComponent implements OnInit {
  isLoading: boolean = true;

  redirectToProjectForm() {
    // Programmatically navigate to another route
    this.router.navigate(['main/academicprojects/addproject']);
  }
  

  displayedColumns: string[] = [ 'program', 'category', 'title', 'author', 'date_published', 'action'];
  
  // <PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator, {static:true}) paginator: MatPaginator;
  @ViewChild(MatPaginator, {static:true}) paginatior !: MatPaginator;
  @ViewChild(MatSort, {static:true}) sort !: MatSort;

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

  protected projects: any = null;
  protected dataSource!: any;
  protected programs: any;
  protected departments: any;
  protected departmentFilter = '';
  protected categories: any;

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.isLoading = true;
    this.ds.get('projects').subscribe((res: any) => {
      this.projects = res;
      this.dataSource = new MatTableDataSource(this.projects);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      
      // Extract unique categories from projects
      const uniqueCategories = new Set<string>();
      this.projects.forEach((project: any) => {
          uniqueCategories.add(project.category);
      });

      // Convert the Set back to an array
      this.categories = Array.from(uniqueCategories);
    });

    this.ds.get('programs').subscribe((res: any) => {
      this.programs = res;

      // Extract unique department names from programs
      const uniqueDepartments = new Set<string>();
      this.programs.forEach((program: any) => {
          uniqueDepartments.add(program.department);
      });

      // Convert the Set back to an array
      this.departments = Array.from(uniqueDepartments);
    })
  }

  changedDepartment(event: Event) {
    const selectDepartment = (document.getElementById('filter-department') as HTMLSelectElement).value;
    this.departmentFilter = selectDepartment;
  }

  // Filtering 
  applyFilter(event: Event, type: string) {

    // get elements
    const selectDepartment = (document.getElementById('filter-department') as HTMLSelectElement).value;
    let selectProgram = (document.getElementById('filter-program') as HTMLSelectElement).value;
    const selectCategory = (document.getElementById('filter-category') as HTMLSelectElement).value;
    const search = (document.getElementById('search') as HTMLInputElement).value;
    
    // reset program filter upon department filter search
    if(type == 'department'){
      this.departmentFilter = selectDepartment;
      selectProgram = '';
    }

    const titleFilterPredicate = (data: Project, search: string): boolean => {
      return data.title.toLowerCase().trim().includes(search.toLowerCase().trim());
    } 

    const authorFilterPredicate = (data: Project, search: string): boolean => {
      return data.authors.some((x: any) => {
        return x.toLowerCase().trim().includes(search.toLowerCase().trim());
      });
    } 
    
    const departmentFilterPredicate = (data: Project, selectDepartment: string): boolean => {
      return data.program.department === selectDepartment || selectDepartment === '';
    }

    const programFilterPredicate = (data: Project, selectProgram: string): boolean => {
      return data.program.program === selectProgram || selectProgram === '';
    }

    const categoryFilterPredicate = (data: Project, selectCategory: string): boolean => {
      return data.category === selectCategory || selectCategory === '';
    }

    const filterPredicate = (data: Project): boolean => {
      return (titleFilterPredicate(data, search) || authorFilterPredicate(data, search)) &&
              departmentFilterPredicate(data, selectDepartment) &&
              programFilterPredicate(data, selectProgram) &&
              categoryFilterPredicate(data, selectCategory);
    };

    this.dataSource.filterPredicate = filterPredicate;
    this.dataSource.filter = {
      search, 
      selectDepartment, 
      selectProgram, 
      selectCategory
    };
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
      if(result === 'Changed Data') {
        this.getData();
      }
    });
  }

  // SWEETALERT ARCHIVE POP UP
  archiveBox(id: number){
    Swal.fire({
      title: "Archive Academic Project",
      text: "Are you sure want to archive this academic project?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
      confirmButtonColor: "#AB0E0E",
      cancelButtonColor: "#777777",
      position: 'center',
      willOpen: () => {
        document.body.style.overflowY = 'scroll';
      },
      willClose: () => {
        document.body.style.overflowY = 'scroll';
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.ds.delete('projects/process/' + id).subscribe({
          next: (res: any) => {
            Swal.fire({
              title: "Archiving complete!",
              text: "Academic project has been safely archived.",
              icon: "success",
              confirmButtonText: 'Close',
              confirmButtonColor: "#777777",
            });
            this.getData();
          },
          error: (err: any) => {
            Swal.fire({
              title: "Error",
              text: "Oops an error occured.",
              icon: "error"
            });
            console.log(err);
          }
        });
      };
    });
  }
}

export interface Project {
  created_at: string;
  authors: any;
  program: any;
  category: string;
  title: string;
  date_published: string;
  action: string;
}


