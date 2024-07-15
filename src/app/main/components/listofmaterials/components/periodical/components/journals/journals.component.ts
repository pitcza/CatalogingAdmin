import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import Swal from 'sweetalert2';

import { EditPeriodicalComponent } from '../edit-periodical/edit-periodical.component';
import { PerioDetailsComponent } from '../perio-details/perio-details.component';
import { DataService } from '../../../../../../../services/data/data.service';

@Component({
  selector: 'app-journals',
  templateUrl: './journals.component.html',
  styleUrl: './journals.component.scss',
})

export class JournalsComponent implements OnInit {
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
    this.ds.request('GET', 'materials/periodicals/type/0', null).subscribe({
      next: (res: any) => {
        console.log(res)
        this.dataSource = new MatTableDataSource<PeriodicalElement>(res)
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
  
  // Filtering 
  applyFilter(event: Event) {

    const search = (event.target as HTMLInputElement).value;

    const accessionFilterPredicate = (data: PeriodicalElement, search: string): boolean => {
      return data.accession == search;
    }

    const copyrightFilterPredicate = (data: PeriodicalElement, search: string): boolean => {
      return data.copyright == search;
    }

    const titleFilterPredicate = (data: PeriodicalElement, search: string): boolean => {
      return data.title.toLowerCase().includes(search.toLowerCase());
    }

    const authorFilterPredicate = (data: PeriodicalElement, search: string): boolean => {
      if(data.authors) {
        return data.authors.some((x: any) => {
          return x.toLowerCase().trim().includes(search.toLowerCase().trim());
        });
      } else return false;      
    }

    const publisherFilterPredicate = (data: PeriodicalElement, search: string): boolean => {
      return data.publisher.toLowerCase().includes(search.toLowerCase());
    }

    const filterPredicate = (data: PeriodicalElement): boolean => {
      return (titleFilterPredicate(data, search) ||
              authorFilterPredicate(data, search) ||
              accessionFilterPredicate(data, search) ||
              publisherFilterPredicate(data, search) ||
              copyrightFilterPredicate(data, search))
    };
    
    this.dataSource.filterPredicate = filterPredicate;
    this.dataSource.filter = search;
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
    console.log(code)
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
      if(result === 'Update' || result == 'Archive') {
        this.getData();
      }
    });
  }

  // SWEETALERT ARCHIVE POP UP
  archiveBox(id: string){
    Swal.fire({
      title: "Archive periodical",
      text: "Are you sure want to archive this periodical?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
      confirmButtonColor: "#AB0E0E",
      cancelButtonColor: "#777777",
      scrollbarPadding: false,
      willOpen: () => {
        document.body.style.overflowY = 'scroll';
      },
      willClose: () => {
        document.body.style.overflowY = 'scroll';
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.ds.request('DELETE', 'materials/archive/' + id, null).subscribe({
          next: (res: any) => {
            Swal.fire({
              title: "Archiving complete!",
              text: "periodical has been successfully archived.",
              icon: "success",
              confirmButtonText: 'Close',
              confirmButtonColor: "#777777",
              scrollbarPadding: false,
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
              scrollbarPadding: false,
            });
          }
        })
      }
    });
  }
}

export interface PeriodicalElement {
  created_at: string;
  accession: string;
  title: string;
  authors: any;
  publisher: string;
  copyright: string;
  action: string;
}