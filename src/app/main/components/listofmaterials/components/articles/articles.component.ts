import { Component } from '@angular/core';
import { DataService } from '../../../../../services/data.service';
import { error } from 'console';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrl: './articles.component.scss'
})
export class ArticlesComponent {

  constructor(
    private ds: DataService
  ) { }

  protected articles: any;

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
