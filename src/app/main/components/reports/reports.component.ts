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
    
  }
}
