import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent implements OnInit {

  constructor (
    private ds: DataService
  ) { }

  materialCounts : any;

  ngOnInit(): void {
      this.counts();
  }

  protected counts() {
    this.ds.get('cataloging/reports/material-counts').subscribe({
      next: (res: any) => this.materialCounts = res
    });
  }
}
