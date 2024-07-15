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

  callExport() {
    let route = this.router.url;
    let type = '';

    switch(route) {
      case '/main/reports/material-report/books':
        this.BooksComponent.export();
        break;

      case '/main/reports/material-report/journals':
        this.JournalsComponent.export();
        break;
    }

    switch(type) {
      case 'books':
        this.BooksComponent.export();
        break;

      // case 'journals':
      //   this.JournalsComponent.export();
      //   break;
    }
    
  }

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

  printMaterials() {
    let route = this.router.url;
    let type = '';
    if(route == '/main/reports/material-report/books') {
      type = 'book';
    } else if (route == '/main/reports/material-report/journals') {
      type = 'journal';
    } else if (route == '/main/reports/material-report/magazines') {
      type = 'magazine';
    } else if(route == '/main/reports/material-report/newspapers') {
      type = 'newspaper';
    } else if(route == '/main/reports/material-report/articles') {
      type = 'article';
    }

    // let payload = {
    //   startDate: "2024-5-1",
    //   endDate: "2024-5-20",
    //   // copyright: "2024"
    // }

    let payload = {
      startDate: '',
      endDate: ''
    }

    if (type == 'book' || type == 'journal' || type == 'newspaper' || type == 'magazine' || type == 'article') {
      let startid = 'datepicker-start-' + type;
      let endid = 'datepicker-end-' + type;

        payload = {
        startDate: (document.getElementById(startid) as HTMLInputElement).value,
        endDate: (document.getElementById(endid) as HTMLInputElement).value,
        // copyright: "2024"
      }
    }
    
    // this.ds.reports('cataloging/reports/excel/' + type, payload).subscribe({
    //   next: (res: any) => {
    //     const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    //     const link = document.createElement('a');
    //     link.href = window.URL.createObjectURL(blob);
    //     link.download = 'Cataloging Reports.xlsx';
    //     link.click();
    //     console.log(res)
    //   }, error: (err: any) => {
    //     console.log(err)
    //   }
    // })
    
  }
}
