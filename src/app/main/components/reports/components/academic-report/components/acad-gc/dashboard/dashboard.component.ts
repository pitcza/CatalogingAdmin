import { Component } from '@angular/core';
import { DataService } from '../../../../../../../../services/data/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  
  constructor (
    private ds: DataService,
    private router: Router
  ) { console.log(router.url)}

  materialCounts = {
    GC: 0,
    CCS: 0,
    CEAS: 0,
    CHTM: 0,
    CBA: 0,
    CAHS: 0,
  }

  ngOnInit(): void {
    this.ds.request('GET', 'reports/project-counts', null).subscribe((res: any) => {
      this.materialCounts = res;
      this.materialCounts.GC = this.materialCounts.CCS + this.materialCounts.CEAS + this.materialCounts.CHTM + this.materialCounts.CBA + this.materialCounts.CAHS
    });
  }
}
