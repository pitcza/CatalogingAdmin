import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../../../../../../../services/data.service';

@Component({
  selector: 'app-chtm-dashboard',
  templateUrl: './chtm-dashboard.component.html',
  styleUrl: './chtm-dashboard.component.scss'
})
export class ChtmDashboardComponent {
  constructor (
    private router: Router,
    private ds: DataService
  ) { }

  printMaterials() {

    let payload = {
      startDate: "2024-5-1",
      endDate: "2024-5-19",
      // copyright: "2024"
    }

    this.ds.reports('cataloging/reports/excel/' + 'projects.chtm', payload).subscribe({
      next: (res: any) => {
        const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'example.xlsx';
        link.click();
        console.log(res)
      }, error: (err: any) => {
        console.log(err)
      }
    })
    
  }
}
