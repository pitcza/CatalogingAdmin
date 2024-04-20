import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent implements OnInit{

  constructor (
    private ds: DataService
  ) { }

  protected counts: any = null;

  ngOnInit(): void {
      this.getReports();
  }

  getReports() {
    this.ds.get('cataloging/reports/materials', '').subscribe({
      next: (res: any) => this.counts = res,
      error: (err: any) => console.log(err)
    })
  }

  printReports() {
    this.ds.get('cataloging/reports/pdf', '').subscribe({
      next: (res: any) => console.log(res),
      error: (err: any) => console.log(err)
    })
  }
}
