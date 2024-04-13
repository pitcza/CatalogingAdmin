import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private http: HttpClient
  ) { }

  private url:string = 'http://127.0.0.1:8000/api/';

  public get(endpoint: string, param: string) {
    return this.http.get(this.url+endpoint+param);
  }

  public getImage(endpoint: string, param: string) {
      return this.http.get(this.url+endpoint+param, { responseType: 'blob' }).pipe(
        catchError((error: HttpErrorResponse) => {
          
          return throwError(() => 'HTTP Response: No image found or invalid file found.');
        })
      );
  }

  public post(endpoint: string, param: string, payload: any) {
    return this.http.get(this.url+endpoint+param, payload);
  }
}
