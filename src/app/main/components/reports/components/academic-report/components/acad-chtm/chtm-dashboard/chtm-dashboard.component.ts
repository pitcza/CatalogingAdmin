import { Component } from '@angular/core';
import { DataService } from '../../../../../../../../services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chtm-dashboard',
  templateUrl: './chtm-dashboard.component.html',
  styleUrl: './chtm-dashboard.component.scss'
})
export class ChtmDashboardComponent {
  
  constructor (
    private ds: DataService,
    private router: Router
  ) { console.log(router.url)}

  materialCounts = {
    gc: 0,
    ccs: 0,
    ceas: 0,
    chtm: 0,
    cba: 0,
    cahs: 0,
  }

  ngOnInit(): void {
      this.counts();
  }

  protected counts() {
    this.ds.get('projects').subscribe({
      next: (res: any) => {
        console.log(res)
        res.forEach((x: any) => {
          this.materialCounts.gc++;

          if(x.program.department.department == 'CCS')
            this.materialCounts.ccs++;
          else if(x.program.department.department == 'CEAS')
            this.materialCounts.ceas++;
          else if(x.program.department.department == 'CHTM')
            this.materialCounts.chtm++;
          else if(x.program.department.department == 'CBA')
            this.materialCounts.cba++;
          else if(x.program.department.department == 'CAHS')
            this.materialCounts.cahs++;

          console.log(this.materialCounts)
        });
      }
    });
  }

  printMaterials() {

    let payload = {
      startDate: '',
      endDate: ''
    }

    let type = 'projects.chtm';

    let startid = 'datepicker-start-chtm';
    let endid = 'datepicker-end-chtm';

      payload = {
      startDate: (document.getElementById(startid) as HTMLInputElement).value,
      endDate: (document.getElementById(endid) as HTMLInputElement).value,
      // copyright: "2024"
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
