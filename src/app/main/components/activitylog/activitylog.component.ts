import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'app-activitylog',
  templateUrl: './activitylog.component.html',
  styleUrl: './activitylog.component.scss'
})
export class ActivitylogComponent implements OnInit{
  
  constructor(
    private ds: DataService
  ) { }

  protected activities: any;

  ngOnInit(): void {
      this.getData();
  }

  protected getData(): void {
    this.ds.get('cataloging/logs', '').subscribe((res:any) => {
      console.log(res);
    })
  }
}
