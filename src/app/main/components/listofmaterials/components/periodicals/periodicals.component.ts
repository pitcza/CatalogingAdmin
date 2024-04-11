import { Component } from '@angular/core';
import { DataService } from '../../../../../services/data.service';

@Component({
  selector: 'app-periodicals',
  templateUrl: './periodicals.component.html',
  styleUrl: './periodicals.component.scss'
})
export class PeriodicalsComponent {

  constructor(
    private ds: DataService
  ) { }

  protected periodicals: any;

  ngOnInit(): void {
    this.getData('journal');
}

protected getData(param: string): void {

  this.ds.get('periodicals/type/', param).subscribe((res:any) => {
    console.log(res);
  }, (error: any) => {
    // error function
  })
}

  protected changeType(type: string) {
    this.getData(type);
  }
}
