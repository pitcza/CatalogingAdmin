import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ChangeDetectorRef } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, MatSortModule } from '@angular/material/sort';

// POP UPS
import { EditdetailsComponent } from '../editdetails/editdetails.component';
import { DetailsPopupComponent } from '../details-popup/details-popup.component';
import { ImportProjectsComponent } from '../import-projects/import-projects.component';
import Swal from 'sweetalert2';

import { LoadingComponent } from '../../../loading/loading.component';
import { MainModule } from '../../../../main.module';
import { ProjectService } from '../../../../../services/materials/project/project.service';

@Component({
  selector: 'app-listofprojects',
  templateUrl: './listofprojects.component.html',
  styleUrl: './listofprojects.component.scss',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatCardModule,
    MatTableModule, 
    MatFormFieldModule, 
    MatCardModule,
    MatSortModule,
    CommonModule,
    MainModule,
  ],
})
export class ListofprojectsComponent implements OnInit {

  // FOR PAGINATION NA NAGANA
  itemsPerPage = 10;
  currentPage = 0;
  totalItems = 0;
  totalPages = 0;

  redirectToProjectForm() {
    this.router.navigate(['main/academicprojects/addproject']);
  }
  
  displayedColumns: string[] = [ 'program', 'category', 'title', 'author', 'date_published', 'action'];
  
  @ViewChild(MatSort, {static:true}) sort !: MatSort;

  constructor(
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private dialog: MatDialog,
    private projectService: ProjectService
  ) {
  }

  protected projects: any = null;
  protected dataSource!: any;
  protected programs: any;
  protected departments: any;
  protected departmentFilter = '';
  protected categories: any;
  isLoading = true;

  ngOnInit() {
    this.getData();
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage); // PAGINATION
  }

  // PAGINATION FUNCTIONS
  ngAfterViewInit() {
    this.totalItems = this.dataSource.data.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.updatePaginationInfo();
  }

  updatePagination(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.itemsPerPage = parseInt(selectElement.value);
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.currentPage = 0; // Reset to first page
    this.updatePaginationInfo();
  }

  updatePaginationInfo() {
    const startIndex = this.currentPage * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    const paginatedData = this.projects.slice(startIndex, endIndex);
    this.dataSource = new MatTableDataSource(paginatedData);
    this.dataSource.sort = this.sort;
  }

  getFirstItemNumber(): number {
    return this.currentPage * this.itemsPerPage + 1;
  }

  getLastItemNumber(): number {
    return Math.min((this.currentPage + 1) * this.itemsPerPage, this.totalItems);
  }

  goToFirstPage() {
    this.currentPage = 0;
    this.updatePaginationInfo();
  }

  goToPreviousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updatePaginationInfo();
    }
  }

  goToNextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.updatePaginationInfo();
    }
  }

  goToLastPage() {
    this.currentPage = this.totalPages - 1;
    this.updatePaginationInfo();
  }
  // END ON PAGINATION FUNCTIONS

  getData() {
    this.isLoading = true;
    this.projectService.getProjects().subscribe((res: any) => {
      this.projects = res;
      this.dataSource = new MatTableDataSource(this.projects);
      this.dataSource.sort = this.sort;
      this.totalItems = this.projects.length;
      this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
      this.updatePaginationInfo();
      this.isLoading = false;
    });

    this.projectService.getPrograms().subscribe((res: any) => {
      this.programs = res;

      // Extract unique department names from programs
      const uniqueDepartments = new Set<string>();
      this.programs.forEach((program: any) => {
          uniqueDepartments.add(program.department_short);
      });

      // Convert the Set back to an array
      this.departments = Array.from(uniqueDepartments);

      console.log(this.departments)
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
    // const selectCategory = (document.getElementById('filter-category') as HTMLSelectElement).value;
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
      return data.project_program.department_short === selectDepartment || selectDepartment === '';
    }

    const programFilterPredicate = (data: Project, selectProgram: string): boolean => {
      return data.program === selectProgram || selectProgram === '';
    }

    // const categoryFilterPredicate = (data: Project, selectCategory: string): boolean => {
    //   return data.category === selectCategory || selectCategory === '';
    // }

    const filterPredicate = (data: Project): boolean => {
      return (titleFilterPredicate(data, search) || authorFilterPredicate(data, search)) &&
              departmentFilterPredicate(data, selectDepartment) &&
              programFilterPredicate(data, selectProgram);
    };

    this.dataSource.filterPredicate = filterPredicate;
    this.dataSource.filter = {
      search, 
      selectDepartment, 
      selectProgram
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
    const scrollPosition = window.scrollY;
    window.scrollTo(0, scrollPosition);
  }

  detailsProject(details: any) {
    this.Openpopup(details, 'Project Detail',DetailsPopupComponent);
    const scrollPosition = window.scrollY;
    window.scrollTo(0, scrollPosition);
  }

  // IMPORT PROJECTS POPUP
  isModalOpen: boolean = false
  importProjects(){
    if(this.isModalOpen) {
      return
    }
    this.isModalOpen = true

    let modal = this.dialog.open(ImportProjectsComponent, {});
    modal.afterClosed().subscribe(
      result => {
        this.isModalOpen = false
      }
    )
  }

  Openpopup(details: any, title: any, component:any) {
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
      if(result === 'Update' || result === 'Archive') {
        this.getData();
      }
    });
  }

  // SWEETALERT ARCHIVE POP UP
  archiveBox(id: string){
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
      scrollbarPadding: false,
      willOpen: () => {
        document.body.style.overflowY = 'scroll';
      },
      willClose: () => {
        document.body.style.overflowY = 'scroll';
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.projectService.deleteRecord(id).subscribe({
          next: (res: any) => {
            Swal.fire({
              title: "Archiving complete!",
              text: "Academic project has been safely archived.",
              icon: "success",
              confirmButtonText: 'Close',
              confirmButtonColor: "#777777",
              scrollbarPadding: false
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
  program: string;
  project_program: any;
  category: string;
  title: string;
  date_published: string;
  action: string;
}


