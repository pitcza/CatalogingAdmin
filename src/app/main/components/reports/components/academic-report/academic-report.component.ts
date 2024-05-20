import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../../../../services/data.service';


@Component({
  selector: 'app-academic-report',
  templateUrl: './academic-report.component.html',
  styleUrl: './academic-report.component.scss'
})
export class AcademicReportComponent implements OnInit {

  constructor(
    private router: Router,
    private ds: DataService
  ) { }

  ngOnInit(): void {
      
  }

  // printMaterials() {
  //   let route = this.router.url;
  //   let type = '';
  //   if(route == '/main/reports/academic-report/dashboard/gc') {
  //     type = 'projects.all';
  //   } else if (route == '/main/reports/material-report/journals') {
  //     type = 'journal';
  //   } else if (route == '/main/reports/material-report/magazines') {
  //     type = 'magazine';
  //   }

  //   let payload = {
  //     startDate: "2024-5-1",
  //     endDate: "2024-5-19",
  //     // copyright: "2024"
  //   }
  //   this.ds.reports('cataloging/reports/excel/' + type, payload).subscribe({
  //     next: (res: any) => {
  //       const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  //       const link = document.createElement('a');
  //       link.href = window.URL.createObjectURL(blob);
  //       link.download = 'example.xlsx';
  //       link.click();
  //       console.log(res)
  //     }, error: (err: any) => {
  //       console.log(err)
  //     }
  //   })
    
  // }
}
