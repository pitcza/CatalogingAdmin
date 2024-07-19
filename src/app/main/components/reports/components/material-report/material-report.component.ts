import { Component, ViewChild, effect, OnInit, signal } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { BooksComponent } from './components/books/books.component';
import { JournalsComponent } from './components/journals/journals.component';
import { MagazinesComponent } from './components/magazines/magazines.component';
import { NewspapersComponent } from './components/newspapers/newspapers.component';
import { DataService } from '../../../../../services/data/data.service';

@Component({
  selector: 'app-material-report',
  templateUrl: './material-report.component.html',
  styleUrl: './material-report.component.scss'
})

export class MaterialReportComponent implements OnInit {
  
  constructor (private router: Router, private ds: DataService){ }

  @ViewChild(BooksComponent) BooksComponent!: BooksComponent;
  @ViewChild(JournalsComponent) JournalsComponent!: JournalsComponent;
  @ViewChild(MagazinesComponent) MagazinesComponent!: MagazinesComponent;
  @ViewChild(NewspapersComponent) NewspapersComponent!: NewspapersComponent;

  materialCounts = {
    titles: 0,
    volumes: 0,
    journals: 0,
    magazines: 0,
    newspapers: 0,
    articles: 0
  }

  ngOnInit(): void {  
    this.counts();
  }

  protected counts() {
    this.ds.request('GET', 'reports/material-counts', null).subscribe({
      next: (res: any) => this.materialCounts = res
    });
  }
}
