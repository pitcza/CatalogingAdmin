import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';

// POP UPS
import { EditdetailsComponent } from '../editdetails/editdetails.component';
import { DetailsPopupComponent } from '../details-popup/details-popup.component';
import Swal from 'sweetalert2';

import { LoadingComponent } from '../../../loading/loading.component';
import { MainModule } from '../../../../main.module';
import { DataService } from '../../../../../services/data/data.service';

@Component({
  selector: 'app-listofprojects',
  templateUrl: './listofprojects.component.html',
  styleUrl: './listofprojects.component.scss',
  standalone: true,
  imports: [ 
    MainModule,
  ],
})
export class ListofprojectsComponent implements OnInit {
  redirectToProjectForm() {
    this.router.navigate(['main/academicprojects/addproject']);
  }
  
  displayedColumns: string[] = [ 'program', 'category', 'title', 'author', 'date_published', 'action'];
  
  @ViewChild(MatPaginator, {static:true}) paginator!: MatPaginator;
  @ViewChild(MatSort, {static:true}) sort !: MatSort;

  constructor(
    private router: Router,
    private paginatorIntl: MatPaginatorIntl,
    private changeDetectorRef: ChangeDetectorRef,
    private dialog: MatDialog,
    private ds: DataService
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
  }

  getData() {
    this.isLoading = true;
    this.ds.request('GET', 'projects', null).subscribe((res: any) => {
      this.projects = res;
      this.dataSource = new MatTableDataSource(this.projects);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.isLoading = false;
    });

    this.ds.request('GET', 'programs', null).subscribe((res: any) => {
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
      text: "Are you sure you want to archive this academic project?",
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
        this.ds.request('DELETE', 'projects/archive/' + id, null).subscribe({
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


