
import { Component } from '@angular/core';
import { DataService } from '../../../../../services/data.service';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { EditArticleComponent } from '../edit-article/edit-article.component';
import { ArticleDetailsPopupComponent } from '../article-details-popup/article-details-popup.component';
import { DeletematPopupComponent } from '../deletemat-popup/deletemat-popup.component';
import { DataService } from '../../../../../services/data.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrl: './articles.component.scss',
  standalone: true,
  imports: [
    MatTableModule, 
    MatPaginatorModule, 
    CommonModule
  ]
})
export class ArticlesComponent implements AfterViewInit {
  displayedColumns: string[] = ['dateadd', 'title', 'publisher', 'pubdate', 'action'];
  dataSource: any = null;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator) paginatior !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;

  ngAfterViewInit() {
    this.getData('newspaper');
    this.dataSource.paginator = this.paginator;
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
    this.ds.get('articles/type/', type).subscribe({
      next: (res: any) => {
        this.dataSource = res;

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
    this.router.navigate(['main/academicprojects/articles']); 
  }


  constructor(
    private ds: DataService
  ) { }

  protected articles: any;

  ngOnInit(): void {
      this.getData('journal');
  }

  protected getData(param: string): void {

    this.ds.get('periodicals/type/', param).subscribe((res:any) => {
      console.log(res);
    }, (error: any) => {
      // error function
    })
  }

  protected changeType(type: string) {
    this.getData(type);
  }

  editPopup(code: any) {
    this.Openpopup(code, 'Edit Article', EditArticleComponent);
  }

  detailsPopup(code: any) {
    this.Openpopup(code, 'Article Detail', ArticleDetailsPopupComponent);
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
    title: "Archive Article",
    text: "Are you sure want to archive this article?",
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
        text: "Article has been safely archived.",
        icon: "success"
      });
    }
  });
}

}

// export interface PeriodicElement {
//   dateadd: string;
//   title: string;
//   publisher: string;
//   pubdate: string;
//   action: string;
// }

// const ELEMENT_DATA: PeriodicElement[] = [
//   {dateadd: 'January 01, 2024', title: 'Sample Title One', publisher: 'Czarina Arellano', pubdate: 'Jan. 22, 2017', action: 'ewan'},
//   {dateadd: 'January 01, 2024', title: 'Sample Title Ewan One Two Three', publisher: 'Pauleen Dalida', pubdate: 'Mar. 24, 2017', action: 'ewan'},
//   {dateadd: 'January 01, 2024', title: 'Sample Title One', publisher: 'Czarina Arellano', pubdate: 'Feb. 28, 2017', action: 'ewan'},
//   {dateadd: 'January 01, 2024', title: 'Sample Title Ewan One Two Three', publisher: 'Pauleen Dalida', pubdate: 'June 21, 2017', action: 'ewan'},
//   {dateadd: 'January 01, 2024', title: 'Sample Title One', publisher: 'Czarina Arellano', pubdate: 'May 31, 2017', action: 'ewan'},
//   {dateadd: 'January 01, 2024', title: 'Sample Title Ewan One Two Three', publisher: 'Pauleen Dalida', pubdate: 'Dec. 25 2017', action: 'ewan'},
//   {dateadd: 'January 01, 2024', title: 'Sample Title One', publisher: 'Czarina Arellano', pubdate: 'Jan. 22, 2017', action: 'ewan'},
//   {dateadd: 'January 01, 2024', title: 'Sample Title Ewan One Two Three', publisher: 'Pauleen Dalida', pubdate: 'Mar. 24, 2017', action: 'ewan'},
//   {dateadd: 'January 01, 2024', title: 'Sample Title One', publisher: 'Czarina Arellano', pubdate: 'Feb. 28, 2017', action: 'ewan'},
//   {dateadd: 'January 01, 2024', title: 'Sample Title Ewan One Two Three', publisher: 'Pauleen Dalida', pubdate: 'June 21, 2017', action: 'ewan'},
//   {dateadd: 'January 01, 2024', title: 'Sample Title One', publisher: 'Czarina Arellano', pubdate: 'May 31, 2017', action: 'ewan'},
//   {dateadd: 'January 01, 2024', title: 'Sample Title Ewan One Two Three', publisher: 'Pauleen Dalida', pubdate: 'Dec. 25 2017', action: 'ewan'},
//   {dateadd: 'January 01, 2024', title: 'Sample Title One', publisher: 'Czarina Arellano', pubdate: 'Jan. 22, 2017', action: 'ewan'},
//   {dateadd: 'January 01, 2024', title: 'Sample Title Ewan One Two Three', publisher: 'Pauleen Dalida', pubdate: 'Mar. 24, 2017', action: 'ewan'},
//   {dateadd: 'January 01, 2024', title: 'Sample Title One', publisher: 'Czarina Arellano', pubdate: 'Feb. 28, 2017', action: 'ewan'},
//   {dateadd: 'January 01, 2024', title: 'Sample Title Ewan One Two Three', publisher: 'Pauleen Dalida', pubdate: 'June 21, 2017', action: 'ewan'},
//   {dateadd: 'January 01, 2024', title: 'Sample Title One', publisher: 'Czarina Arellano', pubdate: 'May 31, 2017', action: 'ewan'},
//   {dateadd: 'January 01, 2024', title: 'Sample Title Ewan One Two Three', publisher: 'Pauleen Dalida', pubdate: 'Dec. 25 2017', action: 'ewan'},
//   {dateadd: 'January 01, 2024', title: 'Sample Title One', publisher: 'Czarina Arellano', pubdate: 'Jan. 22, 2017', action: 'ewan'},
//   {dateadd: 'January 01, 2024', title: 'Sample Title Ewan One Two Three', publisher: 'Pauleen Dalida', pubdate: 'Mar. 24, 2017', action: 'ewan'},
//   {dateadd: 'January 01, 2024', title: 'Sample Title One', publisher: 'Czarina Arellano', pubdate: 'Feb. 28, 2017', action: 'ewan'},
//   {dateadd: 'January 01, 2024', title: 'Sample Title Ewan One Two Three', publisher: 'Pauleen Dalida', pubdate: 'June 21, 2017', action: 'ewan'},
//   {dateadd: 'January 01, 2024', title: 'Sample Title One', publisher: 'Czarina Arellano', pubdate: 'May 31, 2017', action: 'ewan'},
//   {dateadd: 'January 01, 2024', title: 'Sample Title Ewan One Two Three', publisher: 'Pauleen Dalida', pubdate: 'Dec. 25 2017', action: 'ewan'},
// ];

