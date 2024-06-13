import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { throwError } from 'rxjs';
import { HeaderService } from './header.service';
import { map, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private http: HttpClient,
    private headers: HeaderService
  ) { }
  
  private cache = new Map<string, any>();
  // private baseUrl:string = 'http://127.0.0.1:8000/api/';
  private baseUrl:string = 'http://26.68.32.39:8000/api/';

  // private baseUrl:string = 'http://192.168.14.174:8000/api/';
  public get(url: string) {
    return this.http.get(this.baseUrl+url, { headers: this.headers.get() });
  }
  
  public post(url: string, formData: FormData) {
    return this.http.post(this.baseUrl+url, formData, { headers: this.headers.get() });
  }

  public delete(url: string) {
    return this.http.delete(this.baseUrl+url, { headers: this.headers.get() });
  }
  
  public reports(url: string, payload: any) {
  return this.http.post(this.baseUrl+url, { payload: payload}, { headers: this.headers.pdf() , responseType: 'blob'});
  }
}
