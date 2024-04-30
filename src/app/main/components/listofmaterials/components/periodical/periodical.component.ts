import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../../../../services/data.service';
//import { SharedDataService } from '../../../../../services/shared-data.service';

@Component({
  selector: 'app-periodical',
  templateUrl: './periodical.component.html',
  styleUrl: './periodical.component.scss'
})
export class PeriodicalComponent implements OnInit {
  
  constructor (
    private ds: DataService,
    //private shared: SharedDataService
  ) { }

  ngOnInit(): void {
      this.ds.get('periodicals').subscribe({
        //next: (res: any) => this.shared.setData(res)
      })
  }
}
