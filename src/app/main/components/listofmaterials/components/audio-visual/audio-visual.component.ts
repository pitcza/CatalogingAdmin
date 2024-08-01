import { Component, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

import { MatPaginator, MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, MatSortModule } from '@angular/material/sort';

import { EditAVComponent } from './edit-av/edit-av.component';
import { ViewAVComponent } from './view-av/view-av.component';
import { DataService } from '../../../../../services/data/data.service';

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
    CommonModule,
    ReactiveFormsModule
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
    private ds: DataService
  ) { 
    this.paginator = new MatPaginator(this.paginatorIntl, this.changeDetectorRef);
  }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.ds.request('GET', 'materials/audio-visuals', null).subscribe({
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
      text: "Are you sure you want to archive this audio-visual?",
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
        this.ds.request('DELETE', 'materials/archive/' + accession, null).subscribe({
          next: (res: any) => {
            Swal.fire({
              title: "Archiving complete!",
              text: "Audio-Visual has been safely archived.",
              icon: "success",
              confirmButtonText: 'Close',
              confirmButtonColor: "#777777",
              scrollbarPadding: false
            }); this.getData();
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