import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../../../services/data/data.service';
import { GcComponent } from './components/acad-gc/gc/gc.component';
import { ViewChild } from '@angular/core';


@Component({
  selector: 'app-academic-report',
  templateUrl: './academic-report.component.html',
  styleUrl: './academic-report.component.scss'
})
export class AcademicReportComponent implements OnInit {

  constructor(private ds: DataService) { }

  ngOnInit(): void {
    this.ds.request('GET', 'projects', null).subscribe((res: any) => {
      this.ds.setProjects(res)
    })
  }
}
