import { Component } from '@angular/core';
import { DataService } from '../../../../../../../../services/data/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ccs-dashboard',
  templateUrl: './ccs-dashboard.component.html',
  styleUrl: './ccs-dashboard.component.scss'
})
export class CcsDashboardComponent {

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
    this.ds.request('GET', 'projects', null).subscribe({
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

    let type = 'projects.ccs';

    let startid = 'datepicker-start-ccs';
    let endid = 'datepicker-end-ccs';

      payload = {
      startDate: (document.getElementById(startid) as HTMLInputElement).value,
      endDate: (document.getElementById(endid) as HTMLInputElement).value,
      // copyright: "2024"
    }
  }
}
