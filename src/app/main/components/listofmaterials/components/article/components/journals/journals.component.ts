import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import Swal from 'sweetalert2';

import { EditArticleComponent } from '../edit-article/edit-article.component';
import { ArticleDetailsComponent } from '../article-details/article-details.component';
import { DataService } from '../../../../../../../services/data.service';

@Component({
  selector: 'app-journals',
  templateUrl: './journals.component.html',
  styleUrl: './journals.component.scss',
  standalone: true,
  imports: [
    MatTableModule, 
    MatPaginatorModule, 
    CommonModule
  ]
})

export class JournalsComponent implements OnInit {
  displayedColumns: string[] = ['title', 'author', 'publisher', 'date_published', 'action'];
  dataSource: any;
  publishers: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;

  ngOnInit() {
    this.getData();
  }

  getData(){
    this.ds.get('articles/type/journal').subscribe({
      next: (res: any) => {
        this.dataSource = new MatTableDataSource<JournalArticle>(res);
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
      if(result === 'Changed Data') {
        this.getData();
      }
    });
  }

  // ARCHIVE POP UP
  archiveBox(id: number){
    Swal.fire({
      title: "Archive Book",
      text: "Are you sure want to archive this article?",
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
        this.ds.delete('articles/process/' + id).subscribe({
          next: (res: any) => {
            Swal.fire({
              title: "Archiving complete!",
              text: "Article has been safely archived.",
              icon: "success",
              confirmButtonText: 'Close',
              confirmButtonColor: "#777777",
              scrollbarPadding: false,
            });
            this.getData();
          },
          error: (err: any) => {
            Swal.fire({
              title: "Error",
              text: "Oops an error occured.",
              icon: "error",
              scrollbarPadding: false,
            });
            console.log(err);
          }
        });
      };
    });
  }  

  // FILTER DATA
  applyFilter(event: Event, type: string) {
    const search = (document.getElementById('search') as HTMLInputElement).value;

    const titleFilterPredicate = (data: JournalArticle, search: string): boolean => {
      return data.title.toLowerCase().includes(search.toLowerCase());
    }

    const authorFilterPredicate = (data: JournalArticle, search: string): boolean => {
      return data.authors.some((x: any) => {
        return x.toLowerCase().trim().includes(search.toLowerCase().trim());
      });
    }

    const publisherFilterPredicate = (data: JournalArticle, select: string): boolean => {
      return data.publisher.toLowerCase().includes(search.toLowerCase());
    }

    const copyrightFilterPredicate = (data: JournalArticle, select: string): boolean => {
      return data.copyright.includes(search);
    }

    const filterPredicate = (data: JournalArticle): boolean => {
      return (titleFilterPredicate(data, search) ||
              authorFilterPredicate(data, search) ||
              publisherFilterPredicate(data, search) || 
              copyrightFilterPredicate(data, search))
    };
    
    this.dataSource.filterPredicate = filterPredicate;
    this.dataSource.filter = search;
  } 

}

// DATA FOR TABLE
export interface JournalArticle {
  created_at: string;
  title: string;
  authors: any;
  copyright: string;
  publisher: string;
  date_published: string;
  action: string;
}