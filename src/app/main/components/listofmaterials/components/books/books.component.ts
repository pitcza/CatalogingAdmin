import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../../../services/data.service';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrl: './books.component.scss'
})
export class BooksComponent implements OnInit{

  constructor(
    private ds: DataService
  ) { }

  protected books: any;

  ngOnInit(): void {
      this.getData();
  }

  protected getData(): void {
    this.ds.get('books', '').subscribe((res:any) => {
      console.log(res);
    })
  }
}
