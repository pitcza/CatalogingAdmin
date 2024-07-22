import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import Swal from 'sweetalert2';

import { EditArticleComponent } from '../edit-article/edit-article.component';
import { ArticleDetailsComponent } from '../article-details/article-details.component';
import { CommonModule } from '@angular/common';
import { DataService } from '../../../../../../../services/data/data.service';
import { Newspaper } from '../../../periodical/components/newspapers/newspapers.component';

@Component({
  selector: 'app-newspapers',
  templateUrl: './newspapers.component.html',
  styleUrl: './newspapers.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule, 
    MatPaginatorModule, 
  ]
})

export class NewspapersComponent implements OnInit {
  displayedColumns: string[] = ['title', 'author', 'publisher', 'date_published', 'action'];
  dataSource: any;
  publishers: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;

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

  ngOnInit(): void {
      this.getData();
  }
  
  getData() {
    this.ds.request('GET', 'materials/articles/type/2', null).subscribe({
      next: (res: any) => {
        this.dataSource = new MatTableDataSource<NewspaperArticle>(res);
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

    const accessionFilterPredicate = (data: NewspaperArticle, search: string): boolean => {
      return data.accession == search;
    }

    const copyrightFilterPredicate = (data: NewspaperArticle, search: string): boolean => {
      return data.date_published.toLowerCase().includes(search.toLowerCase());
    }

    const titleFilterPredicate = (data: NewspaperArticle, search: string): boolean => {
      return data.title.toLowerCase().includes(search.toLowerCase());
    }

    const authorFilterPredicate = (data: NewspaperArticle, search: string): boolean => {
      if(data.authors) {
        return data.authors.some((x: any) => {
          return x.toLowerCase().trim().includes(search.toLowerCase().trim());
        });
      } else return false;      
    }

    const publisherFilterPredicate = (data: NewspaperArticle, search: string): boolean => {
      return data.publisher.toLowerCase().includes(search.toLowerCase());
    }

    const filterPredicate = (data: NewspaperArticle): boolean => {
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
    this.Openpopup(code, 'Edit Article', EditArticleComponent);
  }

  detailsPopup(code: any) {
    this.Openpopup(code, 'Article Detail', ArticleDetailsComponent);
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
      if(result === 'Update' || result === 'Archive') {
        this.getData();
      }
    });
  }

  // ARCHIVE POP UP
  archiveBox(id: string){
    Swal.fire({
      title: "Archive Newspaper",
      text: "Are you sure you want to archive this newspaper?",
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
              text: "Newspaper has been safely archived.",
              icon: "success",
              confirmButtonText: 'Close',
              confirmButtonColor: "#777777",
              scrollbarPadding: false,
            });
            this.getData();
          }
        });
      };
    });
  }  
}

// DATA FOR TABLE
export interface NewspaperArticle {
  accession: string;
  title: string;
  authors: any;
  publisher: string;
  date_published: string;
}