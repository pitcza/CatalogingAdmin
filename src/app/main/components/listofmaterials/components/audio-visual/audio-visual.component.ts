import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

import Swal from 'sweetalert2';

import { MatPaginator, MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ChangeDetectorRef } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { EditAVComponent } from './edit-av/edit-av.component';
import { ViewAVComponent } from './view-av/view-av.component';
import { AVService } from '../../../../../services/materials/AV/av.service';

@Component({
  selector: 'app-audio-visual',
  templateUrl: './audio-visual.component.html',
  styleUrl: './audio-visual.component.scss',
  standalone: true,
  imports: [
    MatCardModule,
    MatTableModule, 
    MatPaginatorModule, 
    MatFormFieldModule, 
    MatSortModule,
    DatePipe,
    CommonModule
  ],
})
export class AudioVisualComponent {
  displayedColumns: string[] = ['title', 'authors', 'copyright', 'action'];

  @ViewChild(MatPaginator, {static:true}) paginator!: MatPaginator;
  @ViewChild(MatSort, {static:true}) sort!: MatSort;

  dataSource: any;

  constructor(
    private router: Router,
    private paginatorIntl: MatPaginatorIntl, 
    private changeDetectorRef: ChangeDetectorRef,
    private dialog: MatDialog,
    private avService: AVService
  ) { 
    this.paginator = new MatPaginator(this.paginatorIntl, this.changeDetectorRef);

    // Sample data, di ko kasi makita popups hehe
    // const initialData: BookElement[] = [
    //   { title: 'Sample 1', authors: 'Author 1', copyright: '2020' },
    //   { title: 'Sample 2', authors: 'Author 2', copyright: '2019' },
    //   { title: 'Sample 3', authors: 'Author 3', copyright: '2018' },
    // ];

    // this.dataSource = new MatTableDataSource(initialData);
  }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.avService.getAll().subscribe({
      next: (res: any) => {
        this.dataSource = new MatTableDataSource<AudioVisualElement, MatPaginator>(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }

  // SWEETALERT ARCHIVE POPUP
  archiveBox(accession: any){
    Swal.fire({
      title: "Archive Audio-Visual",
      text: "Are you sure want to archive this audio-visual?",
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
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.avService.deleteRecord(accession).subscribe({
          next: (res: any) => {
            Swal.fire({
              title: "Archiving complete!",
              text: "Audio-Visual has been safely archived.",
              icon: "success",
              confirmButtonText: 'Close',
              confirmButtonColor: "#777777",
              scrollbarPadding: false
            }); this.getData();
          }, error: (err: any) => {
            Swal.fire({
              title: "Archiving complete!",
              text: "Audio-Visual cannot be archived at the moment.",
              icon: "success",
              confirmButtonText: 'Close',
              confirmButtonColor: "#777777",
              scrollbarPadding: false
            });
          }
        })
        
      };
    });
  }

  //FILTERING 
  applyFilter(event: Event) {
    this.dataSource.filter = (event.target as HTMLInputElement).value;
  }

  // POP UPS
  showPopup: boolean = false;

  closePopup() {
    this.showPopup = this.showPopup;
  }

  redirectToListPage() {
    this.router.navigate(['main/listofmaterials/audio-visual']); 
  }

  editDetails(data: any) {
    this.Openpopup(data, 'Edit Details', EditAVComponent);
    
  }

  viewDetails(data: any) {
    this.Openpopup(data, 'View Details', ViewAVComponent);
  }

  Openpopup(data: any, title: any,component:any) {
    var _popup = this.dialog.open(component, {
      width: '40%',
      enterAnimationDuration: '100ms',
      exitAnimationDuration: '100ms',
      data: {
        title: title,
        accession: data
      }
    });
    _popup.afterClosed().subscribe(result => {
      this.redirectToListPage();
      if(result == 'Update' || result == 'Archive') {
        this.getData();
      }
    });
  }
}

export interface AudioVisualElement {
  title: string;
  authors: any;
  copyright: string;
}