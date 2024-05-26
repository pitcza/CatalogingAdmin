import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../../../services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-material-report',
  templateUrl: './material-report.component.html',
  styleUrl: './material-report.component.scss'
})

export class MaterialReportComponent implements OnInit {
  
  constructor (
    private ds: DataService,
    private router: Router
  ) { console.log(router.url)}

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
    this.ds.get('cataloging/reports/material-counts').subscribe({
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
    
    this.ds.reports('cataloging/reports/excel/' + type, payload).subscribe({
      next: (res: any) => {
        const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'Cataloging Reports.xlsx';
        link.click();
        console.log(res)
      }, error: (err: any) => {
        console.log(err)
      }
    })
    
  }
}
