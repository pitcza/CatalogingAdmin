import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private http: HttpClient
  ) { }

  private url: string = "http://127.0.0.1:8000/api/";

  public get(endpoint: string, param: string): any {
    return this.http.get(this.url+endpoint+param);
  }

  public post(endpoint: string, param: string, payload: any): any {
    return this.http.get(this.url+endpoint+param, payload);
  }
}
