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
import { DataService } from '../../../../../../../services/data.service';

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

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;

  ngOnInit(): void {
      this.getData();
  }
  
  getData() {
    this.ds.get('articles/type/newspaper').subscribe({
      next: (res: any) => {
        this.dataSource = new MatTableDataSource<NewspaperArticle>(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
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

  // POP UPS FUNCTION
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

  // SWEETALERT ARCHIVE POP UP
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


  // DATA FOR FILTERING
  

}

// SAMPLE DATA FOR TABLE
export interface NewspaperArticle {
  created_at: string;
  title: string;
  publisher: string;
  date_published: string;
}