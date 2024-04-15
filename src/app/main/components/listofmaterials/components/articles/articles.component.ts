import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DeletePopupComponent } from '../delete-popup/delete-popup.component';
import { EditArticleComponent } from '../edit-article/edit-article.component';
import { ArticleDetailsPopupComponent } from '../article-details-popup/article-details-popup.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrl: './articles.component.scss',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatTableModule, 
    MatPaginatorModule, 
    MatCardModule
  ]
})
export class ArticlesComponent implements AfterViewInit {
  displayedColumns: string[] = ['dateadd', 'title', 'publisher', 'pubdate', 'action'];
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
    this.Openpopup(code, 'Edit Article', EditArticleComponent);
  }

  deletePopup(code: any) {
    this.Openpopup(code, 'Delete Article', DeletePopupComponent);
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


  // DATA FOR FILTERING
  

}

export interface PeriodicElement {
  dateadd: string;
  title: string;
  publisher: string;
  pubdate: string;
  action: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {dateadd: 'January 01, 2024', title: 'Sample Title One', publisher: 'Czarina Arellano', pubdate: 'Jan. 22, 2017', action: 'ewan'},
  {dateadd: 'January 01, 2024', title: 'Sample Title Ewan One Two Three', publisher: 'Pauleen Dalida', pubdate: 'Mar. 24, 2017', action: 'ewan'},
  {dateadd: 'January 01, 2024', title: 'Sample Title One', publisher: 'Czarina Arellano', pubdate: 'Feb. 28, 2017', action: 'ewan'},
  {dateadd: 'January 01, 2024', title: 'Sample Title Ewan One Two Three', publisher: 'Pauleen Dalida', pubdate: 'June 21, 2017', action: 'ewan'},
  {dateadd: 'January 01, 2024', title: 'Sample Title One', publisher: 'Czarina Arellano', pubdate: 'May 31, 2017', action: 'ewan'},
  {dateadd: 'January 01, 2024', title: 'Sample Title Ewan One Two Three', publisher: 'Pauleen Dalida', pubdate: 'Dec. 25 2017', action: 'ewan'},
  {dateadd: 'January 01, 2024', title: 'Sample Title One', publisher: 'Czarina Arellano', pubdate: 'Jan. 22, 2017', action: 'ewan'},
  {dateadd: 'January 01, 2024', title: 'Sample Title Ewan One Two Three', publisher: 'Pauleen Dalida', pubdate: 'Mar. 24, 2017', action: 'ewan'},
  {dateadd: 'January 01, 2024', title: 'Sample Title One', publisher: 'Czarina Arellano', pubdate: 'Feb. 28, 2017', action: 'ewan'},
  {dateadd: 'January 01, 2024', title: 'Sample Title Ewan One Two Three', publisher: 'Pauleen Dalida', pubdate: 'June 21, 2017', action: 'ewan'},
  {dateadd: 'January 01, 2024', title: 'Sample Title One', publisher: 'Czarina Arellano', pubdate: 'May 31, 2017', action: 'ewan'},
  {dateadd: 'January 01, 2024', title: 'Sample Title Ewan One Two Three', publisher: 'Pauleen Dalida', pubdate: 'Dec. 25 2017', action: 'ewan'},
  {dateadd: 'January 01, 2024', title: 'Sample Title One', publisher: 'Czarina Arellano', pubdate: 'Jan. 22, 2017', action: 'ewan'},
  {dateadd: 'January 01, 2024', title: 'Sample Title Ewan One Two Three', publisher: 'Pauleen Dalida', pubdate: 'Mar. 24, 2017', action: 'ewan'},
  {dateadd: 'January 01, 2024', title: 'Sample Title One', publisher: 'Czarina Arellano', pubdate: 'Feb. 28, 2017', action: 'ewan'},
  {dateadd: 'January 01, 2024', title: 'Sample Title Ewan One Two Three', publisher: 'Pauleen Dalida', pubdate: 'June 21, 2017', action: 'ewan'},
  {dateadd: 'January 01, 2024', title: 'Sample Title One', publisher: 'Czarina Arellano', pubdate: 'May 31, 2017', action: 'ewan'},
  {dateadd: 'January 01, 2024', title: 'Sample Title Ewan One Two Three', publisher: 'Pauleen Dalida', pubdate: 'Dec. 25 2017', action: 'ewan'},
  {dateadd: 'January 01, 2024', title: 'Sample Title One', publisher: 'Czarina Arellano', pubdate: 'Jan. 22, 2017', action: 'ewan'},
  {dateadd: 'January 01, 2024', title: 'Sample Title Ewan One Two Three', publisher: 'Pauleen Dalida', pubdate: 'Mar. 24, 2017', action: 'ewan'},
  {dateadd: 'January 01, 2024', title: 'Sample Title One', publisher: 'Czarina Arellano', pubdate: 'Feb. 28, 2017', action: 'ewan'},
  {dateadd: 'January 01, 2024', title: 'Sample Title Ewan One Two Three', publisher: 'Pauleen Dalida', pubdate: 'June 21, 2017', action: 'ewan'},
  {dateadd: 'January 01, 2024', title: 'Sample Title One', publisher: 'Czarina Arellano', pubdate: 'May 31, 2017', action: 'ewan'},
  {dateadd: 'January 01, 2024', title: 'Sample Title Ewan One Two Three', publisher: 'Pauleen Dalida', pubdate: 'Dec. 25 2017', action: 'ewan'},
];

